import { create } from 'zustand';
import type { DocumentType } from '../types';

interface DocumentStore {
  documents: DocumentType[];
  setDocuments: (documents: DocumentType[]) => void;
  addDocument: (document: DocumentType) => void;
  addDocuments: (documents: DocumentType[]) => void;
  updateDocument: (id: string, updates: Partial<DocumentType>) => void;
  removeDocument: (id: string) => void;
  getDocumentById: (id: string) => DocumentType | undefined;
  getDocumentsByFolder: (folderId: string | null) => DocumentType[];
  reset: () => void;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],

  setDocuments: (documents) => set({ documents }),

  addDocument: (document) =>
    set((state) => ({ documents: [...state.documents, document] })),

  addDocuments: (documents) =>
    set((state) => ({ documents: [...state.documents, ...documents] })),

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

  getDocumentById: (id) => {
    return get().documents.find((doc) => doc.id === id);
  },

  getDocumentsByFolder: (folderId) => {
    const { documents } = get();
    if (folderId === null) {
      return documents.filter((doc) => !doc.folderId);
    }
    return documents.filter((doc) => doc.folderId === folderId);
  },

  reset: () => set({ documents: [] }),
}));
