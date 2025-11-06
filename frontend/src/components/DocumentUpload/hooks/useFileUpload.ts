import { useCallback } from 'react';
import { useUploadStore } from '../../../store/uploadStore';
import { useUIStore } from '../../../store/uiStore';
import { documentService } from '../../../services/documentService';

export const useFileUpload = () => {
  const uploadProgress = useUploadStore((state) => state.uploadProgress);
  const selectedFolderId = useUIStore((state) => state.selectedFolderId);

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      try {
        await documentService.uploadFiles(files, selectedFolderId || undefined);
      } catch (error) {
        console.error('Upload error:', error);
        throw error;
      }
    },
    [selectedFolderId]
  );

  const isUploading = uploadProgress.some(
    (item) => item.status === 'uploading' || item.status === 'processing'
  );

  return {
    uploadFiles,
    uploadProgress,
    isUploading,
    selectedFolderId,
  };
};

