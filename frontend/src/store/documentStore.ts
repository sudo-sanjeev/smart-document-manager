import { create } from 'zustand';
import type { DocumentType, FolderType, UploadProgress } from '../types';

interface DocumentStore {
  // State
  documents: DocumentType[];
  folders: FolderType[];
  selectedDocumentId: string | null;
  selectedFolderId: string | null;
  viewMode: 'original' | 'summary' | 'markdown';
  uploadProgress: UploadProgress[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setDocuments: (documents: DocumentType[]) => void;
  addDocument: (document: DocumentType) => void;
  updateDocument: (id: string, updates: Partial<DocumentType>) => void;
  removeDocument: (id: string) => void;
  setFolders: (folders: FolderType[]) => void;
  addFolder: (folder: FolderType) => void;
  setSelectedDocument: (id: string | null) => void;
  setSelectedFolder: (id: string | null) => void;
  setViewMode: (mode: 'original' | 'summary' | 'markdown') => void;
  setUploadProgress: (progress: UploadProgress[]) => void;
  addUploadProgress: (progress: UploadProgress) => void;
  updateUploadProgress: (filename: string, updates: Partial<UploadProgress>) => void;
  removeUploadProgress: (filename: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  // Initial state
  documents: [],
  folders: [],
  selectedDocumentId: null,
  selectedFolderId: null,
  viewMode: 'original',
  uploadProgress: [],
  isLoading: false,
  error: null,

  // Actions
  setDocuments: (documents) => set({ documents }),
  
  addDocument: (document) =>
    set((state) => ({ documents: [...state.documents, document] })),
  
  updateDocument: (id, updates) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, ...updates } : doc
      ),
    })),
  
  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
    })),
  
  setFolders: (folders) => set({ folders }),
  
  addFolder: (folder) =>
    set((state) => ({ folders: [...state.folders, folder] })),
  
  setSelectedDocument: (id) => set({ selectedDocumentId: id }),
  
  setSelectedFolder: (id) => set({ selectedFolderId: id }),
  
  setViewMode: (mode) => set({ viewMode: mode }),
  
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  
  addUploadProgress: (progress) =>
    set((state) => ({
      uploadProgress: [...state.uploadProgress, progress],
    })),
  
  updateUploadProgress: (filename, updates) =>
    set((state) => ({
      uploadProgress: state.uploadProgress.map((item) =>
        item.filename === filename ? { ...item, ...updates } : item
      ),
    })),
  
  removeUploadProgress: (filename) =>
    set((state) => ({
      uploadProgress: state.uploadProgress.filter(
        (item) => item.filename !== filename
      ),
    })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  reset: () =>
    set({
      documents: [],
      folders: [],
      selectedDocumentId: null,
      selectedFolderId: null,
      viewMode: 'original',
      uploadProgress: [],
      isLoading: false,
      error: null,
    }),
}));

