import { create } from 'zustand';
import type { FolderType } from '../types';

interface FolderStore {
  folders: FolderType[];
  setFolders: (folders: FolderType[]) => void;
  addFolder: (folder: FolderType) => void;
  updateFolder: (id: string, updates: Partial<FolderType>) => void;
  removeFolder: (id: string) => void;
  getFolderById: (id: string) => FolderType | undefined;
  getRootFolders: () => FolderType[];
  getSubFolders: (parentId: string) => FolderType[];
  reset: () => void;
}

export const useFolderStore = create<FolderStore>((set, get) => ({
  folders: [],
  
  setFolders: (folders) => set({ folders }),

  addFolder: (folder) =>
    set((state) => ({ folders: [...state.folders, folder] })),

  updateFolder: (id, updates) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === id ? { ...folder, ...updates } : folder
      ),
    })),

  removeFolder: (id) =>
    set((state) => ({
      folders: state.folders.filter((folder) => folder.id !== id),
    })),

  getFolderById: (id) => {
    return get().folders.find((folder) => folder.id === id);
  },

  getRootFolders: () => {
    return get().folders.filter((folder) => !folder.parentId);
  },

  getSubFolders: (parentId) => {
    return get().folders.filter((folder) => folder.parentId === parentId);
  },

  reset: () => set({ folders: [] }),
}));

