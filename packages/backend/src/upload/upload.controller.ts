import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../s3/s3.service';
import { memoryStorage } from 'multer';

@Controller('upload')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

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
    @Body() body: Record<string, string>, // metadata sent in form fields
  ) {
    if (!file) {
      return { message: 'File is required' };
    }

    const metadata = {
      subject: body.subject || '',
      title: body.title || '',
      format: body.format || '',
      source: body.source || '',
    };

    const bucket = process.env.AWS_S3_BUCKET_NAME;

    const filename = file.originalname;    
    await this.s3Service.uploadFile(
      bucket,
      filename,
      file.buffer, //contains the uploaded file as a Buffer in memory
      file.mimetype,
      metadata,
    );

    return { message: 'File uploaded successfully', filename };
  }
}