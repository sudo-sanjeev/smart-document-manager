import { useState } from 'react';
import { 
  Folder, 
  ChevronRight, 
  ChevronDown, 
  FolderPlus, 
  MoreVertical,
  Trash2
} from 'lucide-react';
import type { FolderType, DocumentType } from '../../../types';
import { FileItem } from './FileItem';
import './FolderItem.css';

interface FolderItemProps {
  folder: FolderType;
  level: number;
  documents: DocumentType[];
  isExpanded: boolean;
  isSelected: boolean;
  selectedDocumentId: string | null;
  onToggle: () => void;
  onSelect: () => void;
  onCreateSubfolder: () => void;
  onDelete: () => void;
  onDocumentClick: (docId: string) => void;
  onDocumentDelete: (docId: string) => void;
}

export const FolderItem = ({
  folder,
  level,
  documents,
  isExpanded,
  isSelected,
  selectedDocumentId,
  onToggle,
  onSelect,
  onCreateSubfolder,
  onDelete,
  onDocumentClick,
  onDocumentDelete,
}: FolderItemProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleMenuAction = (action: () => void) => {
    setShowMenu(false);
    action();
  };

  return (
    <div className="folder-item">
      <div
        className={`folder-header ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${level * 1.5}rem` }}
      >
        <button
          className="folder-toggle"
          onClick={onToggle}
          aria-label={isExpanded ? 'Collapse folder' : 'Expand folder'}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        
        <button className="folder-name-btn" onClick={onSelect}>
          <Folder size={16} />
          <span>{folder.name}</span>
        </button>

        <div className="folder-actions">
          <button
            className="icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              onCreateSubfolder();
            }}
            title="Add subfolder"
          >
            <FolderPlus size={14} />
          </button>

          <div className="menu-container">
            <button
              className="icon-btn"
              onClick={handleMenuClick}
              title="More options"
            >
              <MoreVertical size={14} />
            </button>

            {showMenu && (
              <>
                <div 
                  className="menu-backdrop" 
                  onClick={() => setShowMenu(false)} 
                />
                <div className="context-menu">
                  <button
                    className="menu-item danger"
                    onClick={() => handleMenuAction(onDelete)}
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="folder-content">
          {documents.map((doc) => (
            <FileItem
              key={doc.id}
              document={doc}
              level={level + 1}
              isSelected={selectedDocumentId === doc.id}
              onClick={() => onDocumentClick(doc.id)}
              onDelete={() => onDocumentDelete(doc.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

