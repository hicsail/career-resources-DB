const keywordExtractor = require('keyword-extractor');

export function extractKeywordsFromPhrase(phrase: string): string[] {
  return keywordExtractor.extract(phrase, {
    language: 'english',
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true,
  });
}