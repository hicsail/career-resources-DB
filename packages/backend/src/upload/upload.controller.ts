import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { S3Service } from '../s3/s3.service';
import { DocumentMetadataService } from '../document-metadata/document-metadata.service';
import { toHeaderSafe, generateDocumentIdFromContent } from './utils/upload-utils';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UploadDto } from './upload.dto';

@Controller('upload')
export class UploadController {
  private readonly bucketName: string;

  constructor(
    private readonly s3Service: S3Service,
    private readonly documentMetadataService: DocumentMetadataService,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>(
      'AWS_S3_BUCKET_NAME', 
      'career-resources'
    );
  }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (_, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          return cb(new BadRequestException('Only PDF files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadDto,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    try {
      // Generate deterministic documentId from file content
      const documentId = generateDocumentIdFromContent(file.buffer);
      // Check for duplicates
      const duplicate = await this.documentMetadataService.getMetadataByDocumentId(documentId);
      if (duplicate) {
        throw new BadRequestException('File already exists in the system');
      }

      const metadata = {
        subject: body.subject,
        title: toHeaderSafe(body.title),
        format: body.format,
        source: body.source,
      };
      const filename = file.originalname;
      await this.s3Service.uploadFile(
        this.bucketName, 
        filename, 
        file.buffer, 
        file.mimetype,
        metadata
       );
      return { message: 'File uploaded successfully', filename, documentId };
    } catch (error) {
      console.error('Upload failed:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('Failed to upload file. Please try again later.');
    }
  }
}