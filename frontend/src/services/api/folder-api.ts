import type { FolderType, APIResponse } from '../../types';
import { api, FOLDER_ENDPOINTS } from './constants';

export const folderAPI = {

  createFolder: async (name: string, parentId?: string): Promise<FolderType> => {
    const response = await api.post<APIResponse<FolderType>>(FOLDER_ENDPOINTS.FOLDERS, {
      name,
      parentId,
    });
    return response.data.data!;
  },

  getAllFolders: async (): Promise<FolderType[]> => {
    const response = await api.get<APIResponse<FolderType[]>>(FOLDER_ENDPOINTS.FOLDERS);
    return response.data.data || [];
  },

  getFolderById: async (id: string): Promise<FolderType | null> => {
    const response = await api.get<APIResponse<FolderType>>(FOLDER_ENDPOINTS.FOLDER_BY_ID(id));
    return response.data.data || null;
  },

  deleteFolder: async (id: string): Promise<void> => {
    await api.delete(FOLDER_ENDPOINTS.FOLDER_BY_ID(id));
  },

  getFolderTree: async (): Promise<FolderType[]> => {
    const response = await api.get<APIResponse<FolderType[]>>(FOLDER_ENDPOINTS.FOLDER_TREE);
    return response.data.data || [];
  },
};

