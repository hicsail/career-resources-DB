import axios, { AxiosResponse } from 'axios';
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
  searchResources: (phrase?: string, subjects?: string[], formats?: string[], sources?: string[]) => Promise<any>;
  getAllDocumentMetadata: () => Promise<any>;
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
    // Set default Axios Authorization header
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // -------- API Functions using runtime base URL --------
  const uploadFile = async (
    file: File,
    metadata: { title: string; subject: string; format: string; source: string }
  ): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', metadata.title);
    formData.append('subject', metadata.subject);
    formData.append('format', metadata.format);
    formData.append('source', metadata.source);

    const url = `${VITE_API_BASE_URL}/${API_ENDPOINTS.UPLOAD_FILE}`;
    const response: AxiosResponse = await axios.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  };

  const searchResources = async (
    phrase?: string,
    subjects?: string[],
    formats?: string[],
    sources?: string[]
  ): Promise<any> => {
    const params: Record<string, any> = {};
    if (phrase) params.phrase = phrase;
    if (subjects) params.subjects = subjects;
    if (formats) params.formats = formats;
    if (sources) params.sources = sources;

    const url = `${VITE_API_BASE_URL}/${API_ENDPOINTS.SEARCH_RESOURCES}`;
    const response: AxiosResponse = await axios.get(url, { params });
    return response.data;
  };

  const getAllDocumentMetadata = async (): Promise<any> => {
    const url = `${VITE_API_BASE_URL}/${API_ENDPOINTS.GET_ALL_METADATA}`;
    const response: AxiosResponse = await axios.get(url);
    return response.data;
  };

  return (
    <ApiContext.Provider value={{ uploadFile, searchResources, getAllDocumentMetadata }}>
      {children}
    </ApiContext.Provider>
  );
};

// -------- Hook to use API --------
export const useApiServices = () => useContext(ApiContext);