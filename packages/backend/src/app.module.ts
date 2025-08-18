import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SearchModule } from './search/search.module';
import { DocumentMetadataModule } from './document-metadata/document-metadata.module';
import { KeywordIndexModule } from './keyword-index/keyword-index.module';
import { S3Module } from './s3/s3.module';
import { UploadController } from './upload/upload.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        signOptions: {
          algorithm: 'RS256',
          expiresIn: '20d',
        },
      }),
      inject: [ConfigService],
    }),
    SearchModule,
    KeywordIndexModule, 
    DocumentMetadataModule, 
    S3Module
  ],
  controllers: [UploadController]
})
export class AppModule {}