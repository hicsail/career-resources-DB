export interface SearchFiltersType {
  phrase?: string;
  subjects?: string[];
  formats?: string[];
  sources?: string[];
  startYear?: number | null; 
  endYear?: number | null;
}

export interface SearchResultType {
  link: string;
  title: string;
}