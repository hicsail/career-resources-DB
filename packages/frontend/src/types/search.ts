export interface SearchFiltersType {
  phrase: string;
  subject?: string;
  format?: string;
  source?: string;
}

export interface SearchResultType {
  link: string;
  title: string;
}