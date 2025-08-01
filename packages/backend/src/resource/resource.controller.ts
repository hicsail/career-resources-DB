import { Controller, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResourceService } from './resource.service';

@Controller('resources')
export class ResourceController {
  constructor(
    private readonly ResourceService: ResourceService,
    private readonly configService: ConfigService
  ) {}

  @Get('search')
  async search (
    @Query('keyword') keyword: string, 
    @Query('tag') tag?: string
  ) {
    if (!keyword) {
      return { message: 'Keyword is required' };
    }

    const results = await this.ResourceService.searchByKeyword(keyword, tag);
    //const region = this.configService.get<string>('AWS_REGION');

    // Map to relevant fields
    return results.map((item) => ({
      title: item.title,
      //count: item.count,
      //link: `https://${item.s3Bucket}.s3.${region}.amazonaws.com/${item.s3Key}`
      tag: item.tag,
      link: item.link
    }));
  }
}