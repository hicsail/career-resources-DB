import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(
    @Query('phrase') phrase?: string,
    @Query('subject') subject?: string,
    @Query('format') format?: string,
    @Query('source') source?: string
  ) {    
    return this.searchService.searchAndFilter(phrase, subject, format, source);
  }
}