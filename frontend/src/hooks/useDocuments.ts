import { useEffect } from 'react';
import { useDocumentStore } from '../store/documentStore';
import { documentAPI, folderAPI } from '../services/api';

export const useDocuments = () => {
  const {
    documents,
    folders,
    selectedDocumentId,
    selectedFolderId,
    viewMode,
    uploadProgress,
    isLoading,
    error,
    setDocuments,
    addDocument,
    setFolders,
    addFolder,
    setSelectedDocument,
    setSelectedFolder,
    setViewMode,
    addUploadProgress,
    updateUploadProgress,
    removeUploadProgress,
    setLoading,
    setError,
    updateDocument,
  } = useDocumentStore();

  // Load documents and folders on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [docs, folds] = await Promise.all([
        documentAPI.getAllDocuments(),
        folderAPI.getAllFolders(),
      ]);
      setDocuments(docs);
      setFolders(folds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async (files: File[], folderId?: string) => {
    try {
      // Add upload progress for each file
      files.forEach((file) => {
        addUploadProgress({
          filename: file.name,
          progress: 0,
          status: 'uploading',
        });
      });

      // Upload files
      const uploadedDocs = await documentAPI.uploadDocuments(files, folderId);

      // Update progress
      files.forEach((file) => {
        updateUploadProgress(file.name, {
          progress: 100,
          status: 'processing',
        });
      });

      // Poll for processing status
      uploadedDocs.forEach((doc) => {
        pollDocumentStatus(doc.id, doc.name);
      });

      // Add documents to store
      uploadedDocs.forEach((doc) => addDocument(doc));

      return uploadedDocs;
    } catch (err) {
      files.forEach((file) => {
        updateUploadProgress(file.name, {
          status: 'failed',
          error: err instanceof Error ? err.message : 'Upload failed',
        });
      });
      throw err;
    }
  };

  const pollDocumentStatus = async (docId: string, filename: string) => {
    const maxAttempts = 30; // 30 attempts = ~1 minute
    let attempts = 0;

    const poll = setInterval(async () => {
      try {
        attempts++;
        const doc = await documentAPI.getDocumentById(docId);

        if (doc && doc.processingStatus === 'completed') {
          updateUploadProgress(filename, {
            status: 'completed',
            progress: 100,
          });
          updateDocument(docId, doc);
          clearInterval(poll);
          
          // Remove progress after 2 seconds
          setTimeout(() => {
            removeUploadProgress(filename);
          }, 2000);
        } else if (doc && doc.processingStatus === 'failed') {
          updateUploadProgress(filename, {
            status: 'failed',
            error: 'AI processing failed',
          });
          clearInterval(poll);
        } else if (attempts >= maxAttempts) {
          updateUploadProgress(filename, {
            status: 'failed',
            error: 'Processing timeout',
          });
          clearInterval(poll);
        }
      } catch (err) {
        console.error('Error polling document status:', err);
        clearInterval(poll);
      }
    }, 2000);
  };

  const createNewFolder = async (name: string, parentId?: string) => {
    try {
      const folder = await folderAPI.createFolder(name, parentId);
      addFolder(folder);
      return folder;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create folder');
      throw err;
    }
  };

  const selectDocument = (id: string | null) => {
    setSelectedDocument(id);
  };

  const selectFolder = (id: string | null) => {
    setSelectedFolder(id);
  };

  const changeViewMode = (mode: 'original' | 'summary' | 'markdown') => {
    setViewMode(mode);
  };

  const getSelectedDocument = () => {
    return documents.find((doc) => doc.id === selectedDocumentId) || null;
  };

  const getDocumentsByCurrentFolder = () => {
    if (!selectedFolderId) {
      return documents.filter((doc) => !doc.folderId);
    }
    return documents.filter((doc) => doc.folderId === selectedFolderId);
  };

  return {
    documents,
    folders,
    selectedDocumentId,
    selectedFolderId,
    viewMode,
    uploadProgress,
    isLoading,
    error,
    uploadFiles,
    createNewFolder,
    selectDocument,
    selectFolder,
    changeViewMode,
    getSelectedDocument,
    getDocumentsByCurrentFolder,
    refreshData: loadData,
  };
};

