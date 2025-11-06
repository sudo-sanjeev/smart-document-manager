import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const DOCUMENT_ENDPOINTS = {
  DOCUMENTS: '/documents',
  DOCUMENTS_UPLOAD: '/documents/upload',
  DOCUMENT_BY_ID: (id: string) => `/documents/${id}`,
  DOCUMENT_CONTENT: (id: string) => `/documents/${id}/content`,
  DOCUMENTS_BY_FOLDER: (folderId: string) => `/documents/folder/${folderId}`,
} as const;

export const FOLDER_ENDPOINTS = {
  FOLDERS: '/folders',
  FOLDER_BY_ID: (id: string) => `/folders/${id}`,
  FOLDER_TREE: '/folders/tree',
} as const;

