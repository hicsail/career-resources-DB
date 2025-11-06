import { Injectable, Inject } from '@nestjs/common';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DYNAMO_CLIENT } from '../common/dynamo/dynamo.service';
import { sortByStringKey } from './utils/sort.utils';

@Injectable()
export class DocumentMetadataService {
  private readonly tableName = 'document-metadata';

  constructor(
    @Inject(DYNAMO_CLIENT) private readonly docClient: DocumentClient
  ) {}

  async getMetadataByDocumentId(documentId: string): Promise<DocumentClient.AttributeMap | null> {
    const result = await this.docClient
      .get({
        TableName: this.tableName,
        Key: { documentId },
      })
      .promise();

    return result.Item || null;
  }

  async getAllMetadata(): Promise<DocumentClient.ItemList> {
    const params: DocumentClient.QueryInput = {
      TableName: this.tableName,
      IndexName: 'queryAll-uploadedAt-index',
      KeyConditionExpression: '#queryAll = :queryAll',
      ExpressionAttributeNames: { '#queryAll': 'queryAll' },
      ExpressionAttributeValues: { ':queryAll': 'true' },
      ScanIndexForward: false,
    };

    let items: DocumentClient.ItemList = [];
    let lastEvaluatedKey: DocumentClient.Key | undefined;

    do {
      const result = await this.docClient.query({
        ...params,
        ExclusiveStartKey: lastEvaluatedKey,
      }).promise();

      if (result.Items) {
        items = items.concat(result.Items);
      }
      lastEvaluatedKey = result.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    //sort alphabetically by title (case-insensitive), items without title go last
    items.sort(sortByStringKey('title'));
    return items;
  }

  /*async getAllMetadata(): Promise<DocumentClient.ItemList> {
    let items: DocumentClient.ItemList = [];
    let ExclusiveStartKey: DocumentClient.Key | undefined = undefined;

    do {
      const params: DocumentClient.ScanInput = {
        TableName: this.tableName,
        ExclusiveStartKey, // <-- pagination key
      };

      const result = await this.docClient.scan(params).promise();
      if (result.Items) {
        items = items.concat(result.Items); // accumulate items
      }

      ExclusiveStartKey = result.LastEvaluatedKey; // <-- set for next scan if available
    } while (ExclusiveStartKey); // loop until all pages retrieved

    return items;
  }*/

  /*async deleteMetadata(documentId: string): Promise<void> {
    await this.docClient
      .delete({
        TableName: this.tableName,
        Key: { documentId },
      })
      .promise();
  }*/
}