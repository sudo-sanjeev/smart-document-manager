import { create } from 'zustand';
import type { UploadProgress } from '../types';

interface UploadStore {
  // State
  uploadProgress: UploadProgress[];

  // Actions
  setUploadProgress: (progress: UploadProgress[]) => void;
  addUploadProgress: (progress: UploadProgress) => void;
  updateUploadProgress: (filename: string, updates: Partial<UploadProgress>) => void;
  removeUploadProgress: (filename: string) => void;
  clearAllProgress: () => void;
  reset: () => void;
}

export const useUploadStore = create<UploadStore>((set) => ({
  // Initial state
  uploadProgress: [],

  // Actions
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

  clearAllProgress: () => set({ uploadProgress: [] }),

  reset: () => set({ uploadProgress: [] }),
}));

