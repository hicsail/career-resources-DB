import { Injectable } from '@nestjs/common';
import { KeywordIndexService } from '../keyword-index/keyword-index.service';
import { DocumentMetadataService } from '../document-metadata/document-metadata.service';
import { getDocumentIntersection, filterAndFormatResults, extractKeywordsFromPhrase } from './utils/document-utils';

@Injectable()
export class SearchService {
  constructor(
    private readonly keywordService: KeywordIndexService,
    private readonly metadataService: DocumentMetadataService
  ) {}

  async searchByKeyword(
    phrase: string,
    subject?: string,
    format?: string,
    source?: string
  ): Promise<any[]> {    
    const keywords = Array.from(new Set(extractKeywordsFromPhrase(phrase)));

    const docMatchesPerKeyword: Record<string, Set<string>> = {};
    const docIdToKeywordMap: Record<string, Set<string>> = {};

    for (const keyword of keywords) {
      const docIds = await this.keywordService.getDocumentIdsByKeyword(keyword);
      const docSet = new Set(docIds);
      docMatchesPerKeyword[keyword] = docSet;

      docIds.forEach((id) => {
        if (!docIdToKeywordMap[id]) docIdToKeywordMap[id] = new Set();
        docIdToKeywordMap[id].add(keyword);
      });
    }

    const matchingDocIds = getDocumentIntersection(keywords, docMatchesPerKeyword);
    const metadata = await this.metadataService.getAllMetadata();
    return filterAndFormatResults(metadata, matchingDocIds, docIdToKeywordMap, {
      subject,
      format,
      source,
    });
  }
}