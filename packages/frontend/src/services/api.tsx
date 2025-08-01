import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/';

const API_ENDPOINTS = {
  SEARCH_RESOURCES: `${API_BASE_URL}resources/search`,
};

export interface SearchResultType {
  link: string;
  title: string;
}

export async function searchResources(keyword: string, tag?: string): Promise<SearchResultType[]> {
  const params: { keyword: string; tag?: string } = { keyword };
  if (tag) {
    params.tag = tag;
  }
  const response = await axios.get<SearchResultType[]>(API_ENDPOINTS.SEARCH_RESOURCES, {
    params,
  });
  return response.data;
}