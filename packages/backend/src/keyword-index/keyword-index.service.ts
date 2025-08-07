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

  async getDocumentIdsByKeyword(keyword: string): Promise<string[]> {
    const params: DocumentClient.QueryInput = {
      TableName: this.tableName,
      KeyConditionExpression: 'keyword = :kw',
      ExpressionAttributeValues: { ':kw': keyword },
    };

    const result = await this.docClient.query(params).promise();
    return (result.Items || []).map((item) => item.documentId);
  }
}