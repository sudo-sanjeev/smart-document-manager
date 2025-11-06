import { create } from 'zustand';

type ViewMode = 'original' | 'summary' | 'markdown';

interface UIStore {
  selectedDocumentId: string | null;
  selectedFolderId: string | null;
  viewMode: ViewMode;
  isLoading: boolean;
  error: string | null;
  setSelectedDocument: (id: string | null) => void;
  setSelectedFolder: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearSelections: () => void;
  reset: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  selectedDocumentId: null,
  selectedFolderId: null,
  viewMode: 'summary',
  isLoading: false,
  error: null,

  setSelectedDocument: (id) => set({ selectedDocumentId: id }),

  setSelectedFolder: (id) => set({ selectedFolderId: id }),

  setViewMode: (mode) => set({ viewMode: mode }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearSelections: () =>
    set({
      selectedDocumentId: null,
      selectedFolderId: null,
    }),

  reset: () =>
    set({
      selectedDocumentId: null,
      selectedFolderId: null,
      viewMode: 'summary',
      isLoading: false,
      error: null,
    }),
}));

