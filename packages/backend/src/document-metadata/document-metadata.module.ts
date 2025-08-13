import { Module } from '@nestjs/common';
import { DocumentMetadataService } from './document-metadata.service';
import { DocumentMetadataController } from './document-metadata.controller';
import { DynamoModule } from '../common/dynamo/dynamo.service';

@Module({
  imports: [DynamoModule],
  providers: [DocumentMetadataService],
  exports: [DocumentMetadataService],
  controllers: [DocumentMetadataController]
})
export class DocumentMetadataModule {}