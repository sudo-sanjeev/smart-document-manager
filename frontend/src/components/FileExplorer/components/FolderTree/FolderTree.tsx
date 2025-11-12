import type { FolderType, DocumentType } from '../../../../types';
import { FolderItem } from '../FolderItem/FolderItem';
import { FileItem } from '../FileItem/FileItem';

interface FolderTreeProps {
  folders: FolderType[];
  documents: DocumentType[];
  expandedFolders: Set<string>;
  selectedFolderId: string | null;
  selectedDocumentId: string | null;
  onToggleFolder: (folderId: string) => void;
  onSelectFolder: (folderId: string) => void;
  onCreateSubfolder: (parentId: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onDocumentClick: (docId: string) => void;
  onDocumentDelete: (docId: string) => void;
}

export const FolderTree = ({
  folders,
  documents,
  expandedFolders,
  selectedFolderId,
  selectedDocumentId,
  onToggleFolder,
  onSelectFolder,
  onCreateSubfolder,
  onDeleteFolder,
  onDocumentClick,
  onDocumentDelete,
}: FolderTreeProps) => {
  const orphanedDocuments = documents.filter((doc) => !doc.folderId);

  const renderFolder = (folder: FolderType, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolderId === folder.id;
    const folderDocs = documents.filter((doc) => doc.folderId === folder.id);
    const subFolders = folder.children || [];

    return (
      <div key={folder.id}>
        <FolderItem
          folder={folder}
          level={level}
          documents={folderDocs}
          isExpanded={isExpanded}
          isSelected={isSelected}
          selectedDocumentId={selectedDocumentId}
          onToggle={() => onToggleFolder(folder.id)}
          onSelect={() => onSelectFolder(folder.id)}
          onCreateSubfolder={() => onCreateSubfolder(folder.id)}
          onDelete={() => onDeleteFolder(folder.id)}
          onDocumentClick={onDocumentClick}
          onDocumentDelete={onDocumentDelete}
        />
        {isExpanded && subFolders.length > 0 && (
          <div>
            {subFolders.map((subFolder) => renderFolder(subFolder, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {orphanedDocuments.length > 0 && (
        <div className="orphaned-documents">
          {orphanedDocuments.map((doc) => (
            <FileItem
              key={doc.id}
              document={doc}
              level={0}
              isSelected={selectedDocumentId === doc.id}
              onClick={() => onDocumentClick(doc.id)}
              onDelete={() => onDocumentDelete(doc.id)}
            />
          ))}
        </div>
      )}
      {folders.map((folder) => renderFolder(folder))}
    </>
  );

};

