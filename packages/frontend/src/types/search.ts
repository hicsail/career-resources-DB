export interface SearchFiltersType {
  phrase?: string;
  subjects?: string[];
  formats?: string[];
  sources?: string[];
  startYear?: number | null; 
  endYear?: number | null;
  location?: string;
}

export interface SearchResultType {
  link: string;
  title: string;
}