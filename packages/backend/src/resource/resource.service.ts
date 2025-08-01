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

  /*async searchByKeyword(keyword: string): Promise<any[]> {
    let allItems: AWS.DynamoDB.DocumentClient.ItemList = [];
    let lastKey: AWS.DynamoDB.DocumentClient.Key | undefined = undefined;

    do {
      const params: AWS.DynamoDB.DocumentClient.ScanInput = {
        TableName: this.tableName,
        FilterExpression: 'keyword = :keyword',
        ExpressionAttributeValues: {
          ':keyword': keyword,
        },
        ExclusiveStartKey: lastKey,
      };

      const result = await this.docClient.scan(params).promise();

      allItems = allItems.concat(result.Items || []);
      lastKey = result.LastEvaluatedKey;
    } while (lastKey);
    
    return allItems;
  }*/
  
  async searchByKeyword(phrase: string, tag?: string): Promise<any[]> {
    console.log("phrase, tag" , phrase, tag)
    const keywords = extractKeywordsFromPhrase(phrase);
    const uniqueWords = Array.from(new Set(keywords));

    const expressionAttributeValues: AWS.DynamoDB.DocumentClient.ExpressionAttributeValueMap = {};
    const filterParts: string[] = [];

    // Add keyword filtering
    uniqueWords.forEach((word, index) => {
      const key = `:kw${index}`;
      expressionAttributeValues[key] = word;
    });
    const keywordPlaceholders = uniqueWords.map((_, i) => `:kw${i}`).join(', ');
    filterParts.push(`keyword IN (${keywordPlaceholders})`);

    // Add tag filtering (optional)
    if (tag) {
      expressionAttributeValues[":tag"] = tag;
      filterParts.push("tag = :tag");
    }

    const filterExpression = filterParts.join(" AND ");

    let allItems: AWS.DynamoDB.DocumentClient.ItemList = [];
    let lastKey: AWS.DynamoDB.DocumentClient.Key | undefined = undefined;

    do {
      const params: AWS.DynamoDB.DocumentClient.ScanInput = {
        TableName: this.tableName,
        FilterExpression: filterExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ExclusiveStartKey: lastKey,
      };

      const result = await this.docClient.scan(params).promise();
      allItems = allItems.concat(result.Items || []);
      lastKey = result.LastEvaluatedKey;
    } while (lastKey);

    const groupedByDocument: Record<string, {
      title: string;
      s3Key: string;
      s3Bucket: string;
      matchedKeywords: string[];
      tag?: string;
      link?: string;
    }> = {};

    for (const item of allItems) {
      const { documentId, title, s3Key, s3Bucket, keyword, tag, link } = item;

      if (!groupedByDocument[documentId]) {
        groupedByDocument[documentId] = {
          title,
          s3Key,
          s3Bucket,
          matchedKeywords: [],
          tag,
          link,
        };
      }
      groupedByDocument[documentId].matchedKeywords.push(keyword as string);
    }

    const matchingDocuments = Object.values(groupedByDocument).filter(doc =>
      uniqueWords.every(word => doc.matchedKeywords.includes(word))
    );

    return matchingDocuments;
  }
}