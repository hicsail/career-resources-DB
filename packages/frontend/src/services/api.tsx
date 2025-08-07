import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/';

const API_ENDPOINTS = {
  SEARCH_RESOURCES: `${API_BASE_URL}resources/search`,
};

export interface SearchResultType {
  link: string;
  title: string;
}

export async function searchResources(
  keyword: string, 
  subject?: string, 
  format?: string, 
  source?: string
): Promise<SearchResultType[]> {
  const params: { 
    keyword: string; 
    subject?: string; 
    format?:string; 
    source?:string; 
  } = { keyword };
  if (subject) {
    params.subject = subject;
  }
  if (format) {
    params.format = format;
  }
  if (source) {
    params.source = source
  }
  const response = await axios.get<SearchResultType[]>(API_ENDPOINTS.SEARCH_RESOURCES, {
    params,
  });
  return response.data;
}