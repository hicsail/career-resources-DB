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
    @Query('subjects') subjects?: string[],
    @Query('formats') formats?: string[],
    @Query('sources') sources?: string[],
    @Query('startYear') startYear?: number,
    @Query('endYear') endYear?: number
  ) { 
    return this.searchService.searchAndFilter(phrase, subjects, formats, sources, startYear, endYear);
  }
}