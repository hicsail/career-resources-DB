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
  docIdSet?: Set<string>,
  docToKeywordMap?: Record<string, Set<string>>,
  filters: { subjects?: string[]; formats?: string[]; sources?: string[] } = {}
): any[] {
  const hasDocIdFilter = !!docIdSet && docIdSet.size > 0;

  //helper to treat empty arrays as "no filter" and to test membership
  const inFilter = (value: string | undefined, arr?: string[]) =>
    !arr || arr.length === 0 || arr.includes(value ?? "");

  return items
    .filter((item) => {
      if (hasDocIdFilter && !docIdSet!.has(item.documentId)) return false;
      if (!inFilter(item.subject, filters.subjects)) return false;
      if (!inFilter(item.source,  filters.sources))  return false;
      if (!inFilter(item.format,  filters.formats))  return false;
      return true;
    })
    .map((item) => ({
      ...item,
      matchedKeywords: Array.from(docToKeywordMap?.[item.documentId] ?? []),
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