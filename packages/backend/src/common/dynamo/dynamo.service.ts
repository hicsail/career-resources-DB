import { Module, Global } from '@nestjs/common';
import * as AWS from 'aws-sdk';

export const DYNAMO_CLIENT = 'DYNAMO_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: DYNAMO_CLIENT,
      useFactory: () => {
        return new AWS.DynamoDB.DocumentClient({
          region: process.env.AWS_REGION,
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
      },
    },
  ],
  exports: [DYNAMO_CLIENT],
})
export class DynamoModule {}