import { create } from 'zustand';
import type { UploadProgress } from '../types';

interface UploadStore {
  uploadProgress: UploadProgress[];
  setUploadProgress: (progress: UploadProgress[]) => void;
  addUploadProgress: (progress: UploadProgress) => void;
  updateUploadProgress: (filename: string, updates: Partial<UploadProgress>) => void;
  removeUploadProgress: (filename: string) => void;
  clearAllProgress: () => void;
  reset: () => void;
}

export const useUploadStore = create<UploadStore>((set) => ({
  uploadProgress: [],

  setUploadProgress: (progress) => set({ uploadProgress: progress }),

  addUploadProgress: (progress) =>
    set((state) => ({
      uploadProgress: [...state.uploadProgress, progress],
    })),

  updateUploadProgress: (idOrFilename, updates) =>
    set((state) => ({
      uploadProgress: state.uploadProgress.map((item) =>
        item.id === idOrFilename || item.filename === idOrFilename ? { ...item, ...updates } : item
      ),
    })),

  removeUploadProgress: (idOrFilename) =>
    set((state) => ({
      uploadProgress: state.uploadProgress.filter(
        (item) => item.id !== idOrFilename && item.filename !== idOrFilename
      ),
    })),

  clearAllProgress: () => set({ uploadProgress: [] }),

  reset: () => set({ uploadProgress: [] }),
}));

