import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { KeywordIndexModule } from '../keyword-index/keyword-index.module';
import { DocumentMetadataModule } from '../document-metadata/document-metadata.module';

@Module({
  imports: [KeywordIndexModule, DocumentMetadataModule],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}