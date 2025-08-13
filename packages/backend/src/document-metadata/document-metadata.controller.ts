import { Controller, Get } from '@nestjs/common';
import { DocumentMetadataService } from './document-metadata.service';

@Controller('documents-metadata')
export class DocumentMetadataController {
  constructor(private readonly documentMetadataService: DocumentMetadataService) {}

  @Get()
  async getAllMetadata() {
    return this.documentMetadataService.getAllMetadata();
  }
}