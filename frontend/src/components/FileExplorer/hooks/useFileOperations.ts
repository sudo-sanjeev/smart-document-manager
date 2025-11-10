import { useState } from 'react';
import { documentService } from '../../../services/documentService';

interface FileOperationsState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook to handle file and folder operations
 * Provides methods for CRUD operations with loading and error states
 */
export const useFileOperations = () => {
  const [state, setState] = useState<FileOperationsState>({
    isLoading: false,
    error: null,
  });

  const setLoading = (isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  };

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  };

  const createFolder = async (name: string, parentId?: string) => {
    try {
      setLoading(true);
      setError(null);
      await documentService.createFolder(name, parentId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create folder';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await documentService.deleteFolder(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete folder';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await documentService.deleteDocument(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete document';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    ...state,
    createFolder,
    deleteFolder,
    deleteDocument,
  };
};

