import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({ region: process.env.AWS_REGION });
  }

  async uploadFile(
    bucket: string,
    key: string,
    body: Buffer | Uint8Array | Blob | string,
    contentType: string,
    metadata: Record<string, string>
  ): Promise<void> {
    try {      
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        Metadata: metadata,
      });
      await this.s3Client.send(command);
      this.logger.log(`Uploaded file: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to upload file: ${key}`, error as string);
      throw error;
    }
  }
}