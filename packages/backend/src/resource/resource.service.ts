import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { extractKeywordsFromPhrase } from './utils/keyword.utils';


@Injectable()
export class ResourceService {
  private docClient: AWS.DynamoDB.DocumentClient;
  private tableName: string;

  constructor(private configService: ConfigService) {
    AWS.config.update({
      region: this.configService.get<string>('AWS_REGION'),
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    });

    this.docClient = new AWS.DynamoDB.DocumentClient();
    this.tableName = this.configService.get<string>('DYNAMODB_TABLE_NAME');
  }

  async searchByKeyword(
    phrase: string, 
    subject?: string, 
    format?: string, 
    source?: string
  ): Promise<any[]> {
    const keywords = extractKeywordsFromPhrase(phrase);
    const uniqueWords = Array.from(new Set(keywords));
    const docMatchesPerKeyword: Record<string, Set<string>> = {};
    const documentIdToKeywordMap: Record<string, Set<string>> = {};

    // Step 1: Query `resource-index` table for each keyword
    for (const keyword of uniqueWords) {
      const params: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: 'keyword-index',
        KeyConditionExpression: 'keyword = :kw',
        ExpressionAttributeValues: {
          ':kw': keyword
        }
      };

      const result = await this.docClient.query(params).promise();
      const docIds = new Set<string>();

      for (const item of result.Items || []) {
        docIds.add(item.documentId);

        if (!documentIdToKeywordMap[item.documentId]) {
          documentIdToKeywordMap[item.documentId] = new Set();
        }
        documentIdToKeywordMap[item.documentId].add(keyword);
      }

      docMatchesPerKeyword[keyword] = docIds;
    }    
    // Step 2: Intersect all sets to find documents containing all keywords
    const matchingDocumentIds = uniqueWords.reduce((acc, word) => {
      const currentSet = docMatchesPerKeyword[word];
      if (!currentSet) return new Set(); // fail early if one keyword has no match

      return acc
        ? new Set([...acc].filter(x => currentSet.has(x)))
        : new Set(currentSet);
    }, null as Set<string> | null) || new Set();

    // Step 3: Fetch document metadata from `document-metadata` table
       
    const matchingSet = new Set(matchingDocumentIds);
    const queryParams: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: 'document-metadata',
      IndexName: 'queryAll-uploadedAt-index',
      KeyConditionExpression: '#queryAll = :queryAll',
      ExpressionAttributeNames: {
        '#queryAll': 'queryAll'
      },
      ExpressionAttributeValues: {
        ':queryAll': 'true'  
      },            
      ScanIndexForward: false
    };

    const metadataResult = await this.docClient.query(queryParams).promise();    
    const results: any[] = []; 

    // step 4: Apply filters
    for (const metadata of metadataResult.Items || []) {
      if (!matchingSet.has(metadata.documentId)) continue; // filter by documentId in memory
      if (subject && metadata.subject && metadata.subject !== subject)  continue; // filter by subject in memory
      if (source && metadata.source && metadata.source !== source)  continue; // filter by source in memory
      if (format && metadata.format && metadata.format !== format)  continue; // filter by format in memory
      
      results.push({
        documentId: metadata.documentId,
        title: metadata.title,
        s3Key: metadata.s3Key,
        s3Bucket: metadata.s3Bucket,
        uploadedAt: metadata.uploadedAt,
        subject: metadata.subject,
        link: metadata.link,
        source: metadata.source,
        format: metadata.format,
        slnMonthYear: metadata.slnMonthYear,
        sln: metadata.sln,
        countryState: metadata.countryState,
        matchedKeywords: Array.from(documentIdToKeywordMap[metadata.documentId] || []),
      });
    }

    return results;
  }
}