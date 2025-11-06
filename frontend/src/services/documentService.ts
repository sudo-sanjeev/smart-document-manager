import { documentAPI } from '../service-integration/document-api';
import { folderAPI } from '../service-integration/folder-api';
import { useDocumentStore } from '../store/documentStore';
import { useFolderStore } from '../store/folderStore';
import { useUploadStore } from '../store/uploadStore';
import { useUIStore } from '../store/uiStore';

/**
 * Document Service - Business logic for document operations
 * Separated from UI components for better maintainability and testability
 */
export const documentService = {
  /**
   * Load all documents and folders from the API
   */
  loadData: async () => {
    const setDocuments = useDocumentStore.getState().setDocuments;
    const setFolders = useFolderStore.getState().setFolders;
    const setLoading = useUIStore.getState().setLoading;
    const setError = useUIStore.getState().setError;

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
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      console.error('Error loading data:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  },

  /**
   * Upload multiple files to the server
   * @param files - Array of files to upload
   * @param folderId - Optional folder ID to upload files to
   */
  uploadFiles: async (files: File[], folderId?: string) => {
    const addDocument = useDocumentStore.getState().addDocument;
    const addUploadProgress = useUploadStore.getState().addUploadProgress;
    const updateUploadProgress = useUploadStore.getState().updateUploadProgress;

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

      // Update progress to processing
      files.forEach((file) => {
        updateUploadProgress(file.name, {
          progress: 100,
          status: 'processing',
        });
      });

      // Poll for processing status
      uploadedDocs.forEach((doc) => {
        documentService.pollDocumentStatus(doc.id, doc.name);
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
  },

  /**
   * Poll document processing status
   * @param docId - Document ID to poll
   * @param filename - Filename for progress tracking
   */
  pollDocumentStatus: async (docId: string, filename: string) => {
    const updateDocument = useDocumentStore.getState().updateDocument;
    const updateUploadProgress = useUploadStore.getState().updateUploadProgress;
    const removeUploadProgress = useUploadStore.getState().removeUploadProgress;

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
  },

  /**
   * Create a new folder
   * @param name - Folder name
   * @param parentId - Optional parent folder ID
   */
  createFolder: async (name: string, parentId?: string) => {
    const addFolder = useFolderStore.getState().addFolder;
    const setError = useUIStore.getState().setError;

    try {
      const folder = await folderAPI.createFolder(name, parentId);
      addFolder(folder);
      return folder;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create folder';
      setError(errorMessage);
      throw err;
    }
  },

  /**
   * Get a document by ID
   * @param id - Document ID
   */
  getDocumentById: (id: string) => {
    return useDocumentStore.getState().getDocumentById(id);
  },

  /**
   * Get documents by folder ID
   * @param folderId - Folder ID (null for root documents)
   */
  getDocumentsByFolder: (folderId: string | null) => {
    return useDocumentStore.getState().getDocumentsByFolder(folderId);
  },
};

