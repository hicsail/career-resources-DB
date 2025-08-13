import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/';

const API_ENDPOINTS = {
  UPLOAD_FILE: `${API_BASE_URL}upload`,
  SEARCH_RESOURCES: `${API_BASE_URL}search`,
  GET_ALL_METADATA: `${API_BASE_URL}documents-metadata`
};

export async function uploadFile(
  file: File,
  metadata: { title: string; subject: string; format: string; source: string }
) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', metadata.title);
  formData.append('subject', metadata.subject);
  formData.append('format', metadata.format);
  formData.append('source', metadata.source);

  const response = await axios.post(API_ENDPOINTS.UPLOAD_FILE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}

export async function searchResources(
  phrase: string,
  subject?: string,
  format?: string,
  source?: string
) {
  const params: {
    phrase: string;
    subject?: string;
    format?: string;
    source?: string;
  } = { phrase };
  if (subject) params.subject = subject;
  if (format) params.format = format;
  if (source) params.source = source;

  const response = await axios.get(API_ENDPOINTS.SEARCH_RESOURCES, { params });
  return response.data;
}

export async function getAllDocumentMetadata() {
  try {
    const response = await axios.get(API_ENDPOINTS.GET_ALL_METADATA);
    return response.data;
  } catch (error) {
    console.error('Error fetching document metadata:', error);
    throw error;
  }
}