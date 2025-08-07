const keywordExtractor = require('keyword-extractor');

export function getDocumentIntersection(
  keywords: string[],
  docMatches: Record<string, Set<string>>
): Set<string> {
  return keywords.reduce((acc, keyword) => {
    const current = docMatches[keyword];
    if (!current) return new Set(); // fail early
    return acc ? new Set([...acc].filter((id) => current.has(id))) : new Set(current);
  }, null as Set<string> | null) || new Set();
}

export function filterAndFormatResults(
  items: any[],
  docIdSet: Set<string>,
  docToKeywordMap: Record<string, Set<string>>,
  filters: { subject?: string; format?: string; source?: string }
): any[] {
  return items
    .filter((item) => {
      if (!docIdSet.has(item.documentId)) return false;
      if (filters.subject && item.subject !== filters.subject) return false;
      if (filters.source && item.source !== filters.source) return false;
      if (filters.format && item.format !== filters.format) return false;
      return true;
    })
    .map((item) => ({
      ...item,
      matchedKeywords: Array.from(docToKeywordMap[item.documentId] || []),
    }));
}

export function extractKeywordsFromPhrase(phrase: string): string[] {
  return keywordExtractor.extract(phrase, {
    language: 'english',
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true,
  });
} 