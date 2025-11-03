import axios from 'axios';
import type { DocumentType, FolderType, APIResponse } from '../types';

// API base URL - adjust this when backend is ready
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Document API
export const documentAPI = {
  // Upload documents
  uploadDocuments: async (files: File[], folderId?: string): Promise<DocumentType[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    if (folderId) {
      formData.append('folderId', folderId);
    }

    const response = await api.post<APIResponse<DocumentType[]>>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data || [];
  },

  // Get all documents
  getAllDocuments: async (): Promise<DocumentType[]> => {
    const response = await api.get<APIResponse<DocumentType[]>>('/documents');
    return response.data.data || [];
  },

  // Get document by ID
  getDocumentById: async (id: string): Promise<DocumentType | null> => {
    const response = await api.get<APIResponse<DocumentType>>(`/documents/${id}`);
    return response.data.data || null;
  },

  // Get document content (original file)
  getDocumentContent: async (id: string): Promise<Blob> => {
    const response = await api.get(`/documents/${id}/content`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Delete document
  deleteDocument: async (id: string): Promise<void> => {
    await api.delete(`/documents/${id}`);
  },

  // Get documents by folder
  getDocumentsByFolder: async (folderId: string): Promise<DocumentType[]> => {
    const response = await api.get<APIResponse<DocumentType[]>>(`/documents/folder/${folderId}`);
    return response.data.data || [];
  },
};

// Folder API
export const folderAPI = {
  // Create folder
  createFolder: async (name: string, parentId?: string): Promise<FolderType> => {
    const response = await api.post<APIResponse<FolderType>>('/folders', {
      name,
      parentId,
    });
    return response.data.data!;
  },

  // Get all folders
  getAllFolders: async (): Promise<FolderType[]> => {
    const response = await api.get<APIResponse<FolderType[]>>('/folders');
    return response.data.data || [];
  },

  // Get folder by ID
  getFolderById: async (id: string): Promise<FolderType | null> => {
    const response = await api.get<APIResponse<FolderType>>(`/folders/${id}`);
    return response.data.data || null;
  },

  // Delete folder
  deleteFolder: async (id: string): Promise<void> => {
    await api.delete(`/folders/${id}`);
  },

  // Get folder tree
  getFolderTree: async (): Promise<FolderType[]> => {
    const response = await api.get<APIResponse<FolderType[]>>('/folders/tree');
    return response.data.data || [];
  },
};

export default api;

