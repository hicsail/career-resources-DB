import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../s3/s3.service';
import { memoryStorage } from 'multer';
import { DocumentMetadataService } from '../document-metadata/document-metadata.service';
import { toHeaderSafe } from './utils/upload-utils';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import * as crypto from 'crypto';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly documentMetadataService: DocumentMetadataService
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          return cb(new Error('Only PDF files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: Record<string, string>,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Generate documentId based on PDF content (same as Lambda)
    const documentId = crypto.createHash('sha256').update(file.buffer).digest('hex');
    // Check if file already exists in DynamoDB by documentId
    const duplicate = await this.documentMetadataService.getMetadataByDocumentId(documentId);
    if (duplicate) {
      throw new BadRequestException('File already exists in the system');
    }

    //Check if file already exists in DynamoDB
    /*const allMetadata = await this.documentMetadataService.getAllMetadata();
    const duplicate = allMetadata.find(
      (doc) => doc.PDFName?.toLowerCase() === file.originalname.toLowerCase()
    );

    if (duplicate) {      
      throw new BadRequestException('File already exists in the system');
    }*/

    const metadata = {
      subject: body.subject || '',
      title: toHeaderSafe(body.title) || '',
      format: body.format || '',
      source: body.source || '',
    };

    const bucket = process.env.AWS_S3_BUCKET_NAME;
    const filename = file.originalname;

    await this.s3Service.uploadFile(
      bucket,
      filename,
      file.buffer,
      file.mimetype,
      metadata,
    );

    return { message: 'File uploaded successfully', filename };
  }
}