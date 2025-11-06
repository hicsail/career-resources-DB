const keywordExtractor = require('keyword-extractor');

// helper to comma separated values string to a set
const csvToSet = (csv?: string) =>
  new Set(
    (csv ?? '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  );

/* 
* checks if any value in a provided filter list exists inside a csv string.
* retunrs true if at least one filter value matches a value from the csv.
*/
const csvContainsAny = (csv: string | undefined, filter?: string[]) => {
  if (!filter || filter.length === 0) return true; // no filter
  const field = new Set(Array.from(csvToSet(csv)).map(v => v.toLowerCase()));
  const want = new Set(filter.map(v => (v ?? '').trim().toLowerCase()).filter(Boolean));
  for (const v of want) if (field.has(v)) return true; // any match
  return false;
};

/**
 * Returns the intersection of document IDs that match all given keywords.
 *
 * Given a list of keywords and a mapping of `keyword -> Set of document IDs`,
 * this function finds the documents that contain **every** keyword.
 *
 * - If a keyword has no matching documents, the result is an empty Set.
 * - If no keywords are provided, an empty Set is returned.
 *
 * @param keywords - The list of keywords to match against.
 * @param docMatches - A mapping where each keyword maps to a Set of document IDs.
 * @returns A Set of document IDs that match all keywords.
 *
 */
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


/**
 * Filters a list of document items based on multiple criteria and returns
 * the matched results with an added `matchedKeywords` field for each item.
 *
 * This function supports filtering by:
 * - Subjects (comma-separated, ANY-match)
 * - Formats (comma-separated, ANY-match)
 * - Year (exact match or range between startYear and endYear)
 * - Location (country or state; case-insensitive exact match)
 *
 * Additionally, each returned item is enriched with a `matchedKeywords` array
 * derived from the provided `docToKeywordMap`.
 *
 * @param items - The list of document items to filter and format.
 * @param docIdSet - Optional set of document IDs to include (acts as an allow-list).
 * @param docToKeywordMap - Optional mapping of document ID → Set of matched keywords.
 * @param filters - Optional filtering criteria, including subjects, formats, year range, and location.
 * @returns A new array of filtered items, each with an added `matchedKeywords` array.
 *
 */
export function filterAndFormatResults(
  items: any[],
  docIdSet?: Set<string>,
  docToKeywordMap?: Record<string, Set<string>>,
  filters: { 
    subjects?: string[]; 
    formats?: string[]; 
    startYear?: number, 
    endYear?: number,
    location?: string //country or state 
  } = {}
): any[] {
  const hasDocIdFilter = !!docIdSet && docIdSet.size > 0;

  return items
    .filter((item) => {
      // Exclude missing/null year ONLY if year filter is applied
      if (filters.startYear && (item.year == null || item.year === '')) {
        return false;
      }

      // Filter by docId
      if (hasDocIdFilter && !docIdSet!.has(item.documentId)) return false;

      // subject/format support comma-separated multi-values (ANY-match)
      if (!csvContainsAny(item.subject, filters.subjects)) return false;
      if (!csvContainsAny(item.format,  filters.formats))  return false;

      // Filter by startYear and endYear if provided
      const yearNum = item.year ? parseInt(item.year, 10) : NaN;
      if (filters.startYear && !filters.endYear) {
        if (yearNum != filters.startYear) return false;
      } else if (filters.startYear && filters.endYear) {
        if (yearNum < filters.startYear || yearNum > filters.endYear) return false;
      }
  
      // Filter by location (country or state)
      if (filters.location) {
        const filterLoc = filters.location.trim().toLowerCase();
        const itemLoc = item.location?.trim().toLowerCase();
        if (!itemLoc || itemLoc !== filterLoc) return false;
      }

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