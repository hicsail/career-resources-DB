// src/contexts/file-api.context.tsx
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import React, { createContext, FC, useContext, useEffect } from 'react';
import { useSettings } from '../contexts/settings.context';
import { useAuth } from '../contexts/auth.context';

const API_ENDPOINTS = {
  UPLOAD_FILE: 'upload',
  SEARCH_RESOURCES: 'search',
  GET_ALL_METADATA: 'documents-metadata'
};

export interface ApiContextProps {
  uploadFile: (file: File, metadata: { title: string; subject: string; format: string; source: string }) => Promise<any>;
  searchResources: (phrase: string, subject?: string, format?: string, source?: string) => Promise<any>;
  getAllDocumentMetadata: () => Promise<any>;
}

// -------- API Functions --------
export async function uploadFile(file: File, metadata: { title: string; subject: string; format: string; source: string }): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', metadata.title);
  formData.append('subject', metadata.subject);
  formData.append('format', metadata.format);
  formData.append('source', metadata.source);

  const response: AxiosResponse = await axios.post(API_ENDPOINTS.UPLOAD_FILE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data;
}

export async function searchResources(phrase: string, subject?: string, format?: string, source?: string): Promise<any> {
  const params: Record<string, string> = { phrase };
  if (subject) params.subject = subject;
  if (format) params.format = format;
  if (source) params.source = source;

  const response: AxiosResponse = await axios.get(API_ENDPOINTS.SEARCH_RESOURCES, { params });
  return response.data;
}

export async function getAllDocumentMetadata(): Promise<any> {
  try {
    const response: AxiosResponse = await axios.get(API_ENDPOINTS.GET_ALL_METADATA);
    return response.data;
  } catch (error) {
    console.error('Error fetching document metadata:', error);
    throw error;
  }
}

// -------- Context Provider --------
const ApiContext = createContext<ApiContextProps>({} as ApiContextProps);

export interface ApiProviderProps {
  children: React.ReactNode;
}

export const ApiProvider: FC<ApiProviderProps> = ({ children }) => {
  const { token } = useAuth();
  const { VITE_API_BASE_URL } = useSettings();

  useEffect(() => {
    // Set base URL for all requests
    axios.defaults.baseURL = VITE_API_BASE_URL;

    // Set Authorization header if token exists
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token, VITE_API_BASE_URL]);

  return (
    <ApiContext.Provider
      value={{
        uploadFile,
        searchResources,
        getAllDocumentMetadata
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

// -------- Hook to use API --------
export const useFileApi = () => useContext(ApiContext);