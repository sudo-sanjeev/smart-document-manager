import { useState } from 'react';
import { Folder, FolderPlus } from 'lucide-react';
import { useDocumentStore } from '../../store/documentStore';
import { useUIStore } from '../../store/uiStore';
import { useFolderTree } from './hooks/useFolderTree';
import { useFileOperations } from './hooks/useFileOperations';
import { FolderItem } from './components/FolderItem';
import { FileItem } from './components/FileItem';
import './styles.css';

export const FileExplorer = () => {
  const documents = useDocumentStore((state) => state.documents);
  const selectedDocumentId = useUIStore((state) => state.selectedDocumentId);
  const selectedFolderId = useUIStore((state) => state.selectedFolderId);
  const setSelectedDocument = useUIStore((state) => state.setSelectedDocument);
  const setSelectedFolder = useUIStore((state) => state.setSelectedFolder);

  const { folderTree } = useFolderTree();
  const fileOperations = useFileOperations();

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

  const handleFolderClick = (folderId: string | null) => {
    setSelectedFolder(folderId);
    setSelectedDocument(null);
  };

  const handleDocumentClick = (docId: string) => {
    setSelectedDocument(docId);
  };

  const openCreateFolderDialog = (parentId: string | null = null) => {
    setIsCreatingFolder(true);
    setNewFolderParentId(parentId);
    setNewFolderName('');
  };

  const closeCreateFolderDialog = () => {
    setIsCreatingFolder(false);
    setNewFolderParentId(null);
    setNewFolderName('');
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      await fileOperations.createFolder(
        newFolderName.trim(),
        newFolderParentId || undefined
      );
      closeCreateFolderDialog();
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      await fileOperations.deleteFolder(folderId);
      if (selectedFolderId === folderId) {
        setSelectedFolder(null);
      }
    } catch (error) {
      console.error('Failed to delete folder:', error);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await fileOperations.deleteDocument(documentId);
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  const renderFolderTree = (folder: any, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolderId === folder.id;
    const folderDocs = documents.filter((doc) => doc.folderId === folder.id);

    return (
      <FolderItem
        key={folder.id}
        folder={folder}
        level={level}
        documents={folderDocs}
        isExpanded={isExpanded}
        isSelected={isSelected}
        selectedDocumentId={selectedDocumentId}
        onToggle={() => toggleFolder(folder.id)}
        onSelect={() => handleFolderClick(folder.id)}
        onCreateSubfolder={() => openCreateFolderDialog(folder.id)}
        onDelete={() => handleDeleteFolder(folder.id)}
        onDocumentClick={handleDocumentClick}
        onDocumentDelete={handleDeleteDocument}
      />
    );
  };

  const rootDocuments = documents.filter((doc) => !doc.folderId);

  return (
    <div className="file-explorer">
      <div className="explorer-header">
        <h2>Documents</h2>
        <button
          className="add-folder-btn"
          onClick={() => openCreateFolderDialog(null)}
          title="Create new folder"
        >
          <FolderPlus size={18} />
        </button>
      </div>

      {isCreatingFolder && (
        <div className="new-folder-input">
          <input
            type="text"
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateFolder();
              if (e.key === 'Escape') closeCreateFolderDialog();
            }}
            autoFocus
          />
          <button onClick={handleCreateFolder} className="btn-primary">
            Create
          </button>
          <button onClick={closeCreateFolderDialog} className="btn-secondary">
            Cancel
          </button>
        </div>
      )}

      <div className="explorer-content">
        <div
          className={`root-folder ${selectedFolderId === null ? 'selected' : ''}`}
          onClick={() => handleFolderClick(null)}
        >
          <Folder size={16} />
          <span>All Documents</span>
        </div>

        {folderTree.map((folder) => renderFolderTree(folder))}

        {selectedFolderId === null && rootDocuments.length > 0 && (
          <div className="root-documents">
            {rootDocuments.map((doc) => (
              <FileItem
                key={doc.id}
                document={doc}
                level={0}
                isSelected={selectedDocumentId === doc.id}
                onClick={() => handleDocumentClick(doc.id)}
                onDelete={() => handleDeleteDocument(doc.id)}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
