import { useMemo } from 'react';
import { useFolderStore } from '../../../store/folderStore';
import type { FolderType } from '../../../types';

/**
 * Custom hook to build and manage folder tree structure
 */
export const useFolderTree = () => {
  const folders = useFolderStore((state) => state.folders);

  const folderTree = useMemo(() => {
    const folderMap = new Map<string, FolderType>();
    const rootFolders: FolderType[] = [];

    // Create a map of all folders with empty children arrays
    folders.forEach((folder) => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });

    // Build the tree structure
    folders.forEach((folder) => {
      const folderWithChildren = folderMap.get(folder.id)!;
      
      if (folder.parentId && folderMap.has(folder.parentId)) {
        const parent = folderMap.get(folder.parentId)!;
        if (!parent.children) parent.children = [];
        parent.children.push(folderWithChildren);
      } else {
        rootFolders.push(folderWithChildren);
      }
    });

    return rootFolders;
  }, [folders]);

  return { folderTree };
};

