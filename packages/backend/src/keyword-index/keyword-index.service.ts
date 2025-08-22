import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DYNAMO_CLIENT } from '../common/dynamo/dynamo.service';

@Injectable()
export class KeywordIndexService {
  private readonly tableName = 'keyword-index';

  constructor(
    @Inject(DYNAMO_CLIENT) private readonly docClient: DocumentClient
  ) {}

  /*async getDocumentIdsByKeyword(keyword: string): Promise<string[]> {
    const params: DocumentClient.QueryInput = {
      TableName: this.tableName,
      KeyConditionExpression: 'keyword = :kw',
      ExpressionAttributeValues: { ':kw': keyword },
    };

    const result = await this.docClient.query(params).promise();
    return (result.Items || []).map((item) => item.documentId);
  }*/

  async getDocumentIdsByKeyword(keyword: string): Promise<string[]> {
    let items: DocumentClient.ItemList = [];
    let lastEvaluatedKey: DocumentClient.Key | undefined;

    do {
      const params: DocumentClient.QueryInput = {
        TableName: this.tableName,
        KeyConditionExpression: 'keyword = :kw',
        ExpressionAttributeValues: { ':kw': keyword },
        ExclusiveStartKey: lastEvaluatedKey,
      };

      const result = await this.docClient.query(params).promise();

      if (result.Items) {
        items = items.concat(result.Items);
      }
      lastEvaluatedKey = result.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    return items.map((item) => item.documentId);
  }

    /**
   * Deletes keyword-index entries for a given documentId and list of keywords
   * 
   * @param {string} documentId - The ID of the document
   * @param {string[]} keywords - List of keywords to delete
   */
  async deleteKeywordIndexEntries(documentId: string, keywords: string[]): Promise<void> {
    if (!documentId || !Array.isArray(keywords) || keywords.length === 0) {
      console.log("No documentId or keywords provided. Skipping delete.");
      return;
    }

    const deleteRequests = keywords.map(keyword => ({
      DeleteRequest: {
        Key: {
          keyword: keyword,
          documentId: documentId
        }
      }
    }));

    // DynamoDB batchWrite supports max 25 items at a time
    const chunks = [];
    for (let i = 0; i < deleteRequests.length; i += 25) {
      chunks.push(deleteRequests.slice(i, i + 25));
    }

    for (const chunk of chunks) {
      const params = {
        RequestItems: {
          [this.tableName]: chunk
        }
      };

      try {
        await this.docClient.batchWrite(params).promise();
        console.log(`Deleted ${chunk.length} keyword index entries for documentId=${documentId}`);
      } catch (err) {
        console.error("Error deleting keyword index entries:", err);
        throw err;
      }
    }
  }
}