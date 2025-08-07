import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(
    @Query('phrase') phrase: string,
    @Query('subject') subject?: string,
    @Query('format') format?: string,
    @Query('source') source?: string
  ) {    
    return this.searchService.searchByKeyword(phrase, subject, format, source);
  }
}