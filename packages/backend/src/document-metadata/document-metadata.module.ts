import { Module } from '@nestjs/common';
import { DocumentMetadataService } from './document-metadata.service';
import { DynamoModule } from '../common/dynamo/dynamo.service';

@Module({
  imports: [DynamoModule],
  providers: [DocumentMetadataService],
  exports: [DocumentMetadataService],
})
export class DocumentMetadataModule {}