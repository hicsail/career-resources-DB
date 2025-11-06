export interface SearchFiltersType {
  phrase?: string;
  subjects?: string[];
  formats?: string[];
  startYear?: number | null; 
  endYear?: number | null;
  //location?: string;
  state?: string;
  country?: string;
}

export interface SearchResultType {
  link: string;
  title: string;
}