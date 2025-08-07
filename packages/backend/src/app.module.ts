import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SearchModule } from './search/search.module';
import { DocumentMetadataModule } from './document-metadata/document-metadata.module';
import { KeywordIndexModule } from './keyword-index/keyword-index.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    SearchModule,
    KeywordIndexModule, 
    DocumentMetadataModule
  ]
})
export class AppModule {}