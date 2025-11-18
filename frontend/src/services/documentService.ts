import { documentAPI } from './api/document-api';
import { folderAPI } from './api/folder-api';
import { useDocumentStore } from '../store/documentStore';
import { useFolderStore } from '../store/folderStore';
import { useUploadStore } from '../store/uploadStore';
import { useUIStore } from '../store/uiStore';
import { toast } from '../store/toastStore';
import logger from '../utils/logger';


export const documentService = {

  loadData: async () => {
    const setDocuments = useDocumentStore.getState().setDocuments;
    const setFolders = useFolderStore.getState().setFolders;
    const setLoading = useUIStore.getState().setLoading;

    try {
      setLoading(true);

      const [docs, folds] = await Promise.all([
        documentAPI.getAllDocuments(),
        folderAPI.getAllFolders(),
      ]);

      setDocuments(docs);
      setFolders(folds);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      toast.error(errorMessage);
      logger.error(`Error loading data: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  },

  uploadFiles: async (files: File[], folderId?: string) => {
    const addDocument = useDocumentStore.getState().addDocument;
    const addUploadProgress = useUploadStore.getState().addUploadProgress;
    const updateUploadProgress = useUploadStore.getState().updateUploadProgress;

    try {
      const fileIdMap = new Map<string, string>();
      files.forEach((file) => {
        const id = `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        fileIdMap.set(file.name, id);
        addUploadProgress({
          id,
          filename: file.name,
          progress: 0,
          status: 'uploading',
        });
      });

      const uploadedDocs = await documentAPI.uploadDocuments(files, folderId);

      files.forEach((file) => {
        const id = fileIdMap.get(file.name);
        if (id) {
          updateUploadProgress(id, {
            progress: 100,
            status: 'processing',
          });
        }
      });

      uploadedDocs.forEach((doc) => {
        const id = fileIdMap.get(doc.name);
        if (id) {
          documentService.pollDocumentStatus(doc.id, id, doc.name);
        }
      });

      uploadedDocs.forEach((doc) => addDocument(doc));

      return uploadedDocs;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      toast.error(errorMessage);
      
      files.forEach((file) => {
        updateUploadProgress(file.name, {
          status: 'failed',
          error: err instanceof Error ? err.message : 'Upload failed',
        });
      });
      throw err;
    }
  },

  pollDocumentStatus: async (docId: string, uploadProgressId: string, fileName: string) => {
    const updateDocument = useDocumentStore.getState().updateDocument;
    const updateUploadProgress = useUploadStore.getState().updateUploadProgress;
    const removeUploadProgress = useUploadStore.getState().removeUploadProgress;

    const maxAttempts = 30; 
    let attempts = 0;

    const poll = setInterval(async () => {
      try {
        attempts++;
        const doc = await documentAPI.getDocumentById(docId);

        if (doc && doc.processingStatus === 'completed') {
          updateUploadProgress(uploadProgressId, {
            status: 'completed',
            progress: 100,
          });
          updateDocument(docId, doc);
          clearInterval(poll);
          
          toast.success(`${fileName} processed successfully`);

          setTimeout(() => {
            removeUploadProgress(uploadProgressId);
          }, 2000);
        } else if (doc && doc.processingStatus === 'failed') {
          updateUploadProgress(uploadProgressId, {
            status: 'failed',
            error: 'AI processing failed',
          });
          toast.error(`${fileName} processing failed`);
          clearInterval(poll);
        } else if (attempts >= maxAttempts) {
          updateUploadProgress(uploadProgressId, {
            status: 'failed',
            error: 'Processing timeout',
          });
          toast.error(`${fileName} processing timed out`);
          clearInterval(poll);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        logger.error(`Error polling document status: ${errorMessage}`);
        clearInterval(poll);
      }
    }, 2000);
  },

  createFolder: async (name: string, parentId?: string) => {
    const addFolder = useFolderStore.getState().addFolder;

    try {
      const folder = await folderAPI.createFolder(name, parentId);
      addFolder(folder);
      toast.success(`Folder "${name}" created successfully`);
      return folder;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create folder';
      toast.error(errorMessage);
      throw err;
    }
  },

  deleteFolder: async (id: string) => {
    const removeFolder = useFolderStore.getState().removeFolder;

    try {
      await folderAPI.deleteFolder(id);
      removeFolder(id);
      toast.success('Folder deleted successfully');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete folder';
      toast.error(errorMessage);
      throw err;
    }
  },

  deleteDocument: async (id: string) => {
    const removeDocument = useDocumentStore.getState().removeDocument;
    const setSelectedDocument = useUIStore.getState().setSelectedDocument;
    const selectedDocumentId = useUIStore.getState().selectedDocumentId;

    try {
      await documentAPI.deleteDocument(id);
      removeDocument(id);
      if (selectedDocumentId === id) {
        setSelectedDocument(null);
      }
      toast.success('Document deleted successfully');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete document';
      toast.error(errorMessage);
      throw err;
    }
  },

  getDocumentById: (id: string) => {
    return useDocumentStore.getState().getDocumentById(id);
  },

  getDocumentsByFolder: (folderId: string | null) => {
    return useDocumentStore.getState().getDocumentsByFolder(folderId);
  },

  getDocumentContent: async (id: string): Promise<Blob> => {
    return await documentAPI.getDocumentContent(id);
  },
};

