import { Injectable, Inject } from '@nestjs/common';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DYNAMO_CLIENT } from '../common/dynamo/dynamo.service';

@Injectable()
export class DocumentMetadataService {
  private readonly tableName = 'document-metadata';

  constructor(
    @Inject(DYNAMO_CLIENT) private readonly docClient: DocumentClient
  ) {}

  async getAllMetadata(): Promise<DocumentClient.ItemList> {
    const params: DocumentClient.QueryInput = {
      TableName: this.tableName,
      IndexName: 'queryAll-uploadedAt-index',
      KeyConditionExpression: '#queryAll = :queryAll',
      ExpressionAttributeNames: { '#queryAll': 'queryAll' },
      ExpressionAttributeValues: { ':queryAll': 'true' },
      ScanIndexForward: false,
    };

    const result = await this.docClient.query(params).promise();
    return result.Items || [];
  }
}