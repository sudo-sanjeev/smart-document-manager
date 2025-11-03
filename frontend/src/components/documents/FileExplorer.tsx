import { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, FolderPlus } from 'lucide-react';
import { useDocuments } from '../../hooks/useDocuments';
import type { FolderType } from '../../types';
import './FileExplorer.css';

export const FileExplorer = () => {
  const {
    folders,
    documents,
    selectedDocumentId,
    selectedFolderId,
    selectDocument,
    selectFolder,
    createNewFolder,
  } = useDocuments();

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderParent, setNewFolderParent] = useState<string | null>(null);

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
    selectFolder(folderId);
    selectDocument(null);
  };

  const handleDocumentClick = (docId: string) => {
    selectDocument(docId);
  };

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      try {
        await createNewFolder(newFolderName.trim(), newFolderParent || undefined);
        setIsCreatingFolder(false);
        setNewFolderName('');
        setNewFolderParent(null);
      } catch (error) {
        console.error('Failed to create folder:', error);
      }
    }
  };

  const startCreatingFolder = (parentId: string | null = null) => {
    setNewFolderParent(parentId);
    setIsCreatingFolder(true);
  };

  const buildFolderTree = (): FolderType[] => {
    const folderMap = new Map<string, FolderType>();
    const rootFolders: FolderType[] = [];

    // Create a map of all folders
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
  };

  const renderFolder = (folder: FolderType, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolderId === folder.id;
    const folderDocs = documents.filter((doc) => doc.folderId === folder.id);

    return (
      <div key={folder.id} className="folder-item">
        <div
          className={`folder-header ${isSelected ? 'selected' : ''}`}
          style={{ paddingLeft: `${level * 1.5}rem` }}
        >
          <button
            className="folder-toggle"
            onClick={() => toggleFolder(folder.id)}
            aria-label={isExpanded ? 'Collapse folder' : 'Expand folder'}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <button
            className="folder-name-btn"
            onClick={() => handleFolderClick(folder.id)}
          >
            <Folder size={16} />
            <span>{folder.name}</span>
          </button>
          <button
            className="add-folder-btn"
            onClick={() => startCreatingFolder(folder.id)}
            title="Add subfolder"
          >
            <FolderPlus size={14} />
          </button>
        </div>
        {isExpanded && (
          <div className="folder-content">
            {folder.children?.map((child) => renderFolder(child, level + 1))}
            {folderDocs.map((doc) => (
              <div
                key={doc.id}
                className={`file-item ${selectedDocumentId === doc.id ? 'selected' : ''}`}
                style={{ paddingLeft: `${(level + 1) * 1.5 + 0.5}rem` }}
                onClick={() => handleDocumentClick(doc.id)}
              >
                <File size={16} />
                <span className="file-name">{doc.name}</span>
                {doc.processingStatus === 'processing' && (
                  <span className="processing-badge">Processing...</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const folderTree = buildFolderTree();
  const rootDocuments = documents.filter((doc) => !doc.folderId);

  return (
    <div className="file-explorer">
      <div className="explorer-header">
        <h2>Documents</h2>
        <button
          className="add-folder-btn"
          onClick={() => startCreatingFolder(null)}
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
              if (e.key === 'Escape') {
                setIsCreatingFolder(false);
                setNewFolderName('');
              }
            }}
            autoFocus
          />
          <button onClick={handleCreateFolder} className="btn-primary">
            Create
          </button>
          <button
            onClick={() => {
              setIsCreatingFolder(false);
              setNewFolderName('');
            }}
            className="btn-secondary"
          >
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

        {folderTree.map((folder) => renderFolder(folder))}

        {selectedFolderId === null && rootDocuments.length > 0 && (
          <div className="root-documents">
            {rootDocuments.map((doc) => (
              <div
                key={doc.id}
                className={`file-item ${selectedDocumentId === doc.id ? 'selected' : ''}`}
                onClick={() => handleDocumentClick(doc.id)}
              >
                <File size={16} />
                <span className="file-name">{doc.name}</span>
                {doc.processingStatus === 'processing' && (
                  <span className="processing-badge">Processing...</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

