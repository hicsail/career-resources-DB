export interface SearchFiltersType {
  phrase?: string;
  subjects?: string[];
  formats?: string[];
  sources?: string[];
}

export interface SearchResultType {
  link: string;
  title: string;
}