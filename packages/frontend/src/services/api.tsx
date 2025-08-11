import axios from 'axios';
import type { SearchResultType } from '../types/search';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/';

const API_ENDPOINTS = {
  SEARCH_RESOURCES: `${API_BASE_URL}search`,
};

export async function searchResources(
  phrase: string, 
  subject?: string, 
  format?: string, 
  source?: string
): Promise<SearchResultType[]> {
  const params: { 
    phrase: string; 
    subject?: string; 
    format?:string; 
    source?:string; 
  } = { phrase };
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