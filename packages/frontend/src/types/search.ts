export interface SearchFiltersType {
  phrase?: string;
  subjects?: string[];
  formats?: string[];
  startYear?: number | null; 
  endYear?: number | null;
  location?: string;
}

export interface SearchResultType {
  link: string;
  title: string;
}