import { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { useDocumentStore } from '../../store/documentStore';
import { useUIStore } from '../../store/uiStore';
import { useFolderTree } from './hooks/useFolderTree';
import { documentService } from '../../services/documentService';
import { CreateFolderDialog } from './components/CreateFolderDialog/CreateFolderDialog';
import { FolderTree } from './components/FolderTree/FolderTree';
import logger from '../../utils/logger';
import './styles.css';

export const FileExplorer = () => {
  const documents = useDocumentStore((state) => state.documents);
  const selectedDocumentId = useUIStore((state) => state.selectedDocumentId);
  const selectedFolderId = useUIStore((state) => state.selectedFolderId);
  const setSelectedDocument = useUIStore((state) => state.setSelectedDocument);
  const setSelectedFolder = useUIStore((state) => state.setSelectedFolder);

  const { folderTree } = useFolderTree();
  
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderParentId, setNewFolderParentId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const openDialog = (parentId: string | null = null) => {
    setIsCreatingFolder(true);
    setNewFolderParentId(parentId);
    setNewFolderName('');
  };

  const closeDialog = () => {
    setIsCreatingFolder(false);
    setNewFolderParentId(null);
    setNewFolderName('');
  };

  const handleFolderClick = (folderId: string | null) => {
    setSelectedFolder(folderId);
    setSelectedDocument(null);
  };

  const handleDocumentClick = (docId: string) => {
    setSelectedDocument(docId);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await documentService.createFolder(
        newFolderName.trim(),
        newFolderParentId || undefined
      );
      closeDialog();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to create folder: ${errorMessage}`);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      await documentService.deleteFolder(folderId);
      if (selectedFolderId === folderId) {
        setSelectedFolder(null);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to delete folder: ${errorMessage}`);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await documentService.deleteDocument(documentId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to delete document: ${errorMessage}`);
    }
  };

  return (
    <div className="file-explorer">
      <div className="explorer-header">
        <h2>Documents</h2>
        <button
          className="add-folder-btn"
          onClick={() => openDialog(null)}
          title="Create new folder"
        >
          <FolderPlus size={18} />
        </button>
      </div>

      {isCreatingFolder && (
        <CreateFolderDialog
          folderName={newFolderName}
          onFolderNameChange={setNewFolderName}
          onCreate={handleCreateFolder}
          onCancel={closeDialog}
        />
      )}

      <div className="explorer-content">
        <FolderTree
          folders={folderTree}
          documents={documents}
          expandedFolders={expandedFolders}
          selectedFolderId={selectedFolderId}
          selectedDocumentId={selectedDocumentId}
          onToggleFolder={toggleFolder}
          onSelectFolder={handleFolderClick}
          onCreateSubfolder={openDialog}
          onDeleteFolder={handleDeleteFolder}
          onDocumentClick={handleDocumentClick}
          onDocumentDelete={handleDeleteDocument}
        />
      </div>
    </div>
  );
};
