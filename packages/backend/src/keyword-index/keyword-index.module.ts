import { Module } from '@nestjs/common';
import { KeywordIndexService } from './keyword-index.service';
import { DynamoModule } from '../common/dynamo/dynamo.service';

@Module({
  imports: [DynamoModule],
  providers: [KeywordIndexService],
  exports: [KeywordIndexService],
})
export class KeywordIndexModule {}