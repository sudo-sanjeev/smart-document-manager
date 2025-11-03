// Core types and interfaces for the AI Document Vault

export interface DocumentType {
  id: string;
  name: string;
  originalName: string;
  path: string;
  folderId: string | null;
  size: number;
  type: string;
  uploadedAt: string;
  summary?: string;
  markdown?: string;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface FolderType {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  children?: FolderType[];
  documents?: DocumentType[];
}

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
  data?: DocumentType | FolderType;
  children?: FileNode[];
}

export interface UploadProgress {
  filename: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  error?: string;
}

export interface DocumentViewState {
  selectedDocumentId: string | null;
  viewMode: 'original' | 'summary' | 'markdown';
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

