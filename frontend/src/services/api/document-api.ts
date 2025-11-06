import type { DocumentType, APIResponse } from '../../types';
import { api, DOCUMENT_ENDPOINTS } from './constants';

export const documentAPI = {

  uploadDocuments: async (files: File[], folderId?: string): Promise<DocumentType[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    if (folderId) {
      formData.append('folderId', folderId);
    }

    const response = await api.post<APIResponse<DocumentType[]>>(DOCUMENT_ENDPOINTS.DOCUMENTS_UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data || [];
  },

  getAllDocuments: async (): Promise<DocumentType[]> => {
    const response = await api.get<APIResponse<DocumentType[]>>(DOCUMENT_ENDPOINTS.DOCUMENTS);
    return response.data.data || [];
  },

  getDocumentById: async (id: string): Promise<DocumentType | null> => {
    const response = await api.get<APIResponse<DocumentType>>(DOCUMENT_ENDPOINTS.DOCUMENT_BY_ID(id));
    return response.data.data || null;
  },

  getDocumentContent: async (id: string): Promise<Blob> => {
    const response = await api.get(DOCUMENT_ENDPOINTS.DOCUMENT_CONTENT(id), {
      responseType: 'blob',
    });
    return response.data;
  },

  deleteDocument: async (id: string): Promise<void> => {
    await api.delete(DOCUMENT_ENDPOINTS.DOCUMENT_BY_ID(id));
  },

  getDocumentsByFolder: async (folderId: string): Promise<DocumentType[]> => {
    const response = await api.get<APIResponse<DocumentType[]>>(DOCUMENT_ENDPOINTS.DOCUMENTS_BY_FOLDER(folderId));
    return response.data.data || [];
  },
};

