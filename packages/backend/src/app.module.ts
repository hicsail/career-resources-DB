import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SearchModule } from './search/search.module';
import { DocumentMetadataModule } from './document-metadata/document-metadata.module';
import { KeywordIndexModule } from './keyword-index/keyword-index.module';
import { S3Module } from './s3/s3.module';
import { UploadController } from './upload/upload.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    SearchModule,
    KeywordIndexModule, 
    DocumentMetadataModule, 
    S3Module
  ],
  controllers: [UploadController]
})
export class AppModule {}