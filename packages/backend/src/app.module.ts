import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { ResourceModule } from './resource/resource.module';
import { SearchModule } from './search/search.module';
import { DocumentMetadataModule } from './document-metadata/document-metadata.module';
import { KeywordIndexModule } from './keyword-index/keyword-index.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    ResourceModule, SearchModule, KeywordIndexModule, DocumentMetadataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}