import { useState } from 'react';
import { File, MoreVertical, Trash2 } from 'lucide-react';
import type { DocumentType } from '../../../types';
import './FileItem.css';

interface FileItemProps {
  document: DocumentType;
  level: number;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export const FileItem = ({
  document,
  level,
  isSelected,
  onClick,
  onDelete,
}: FileItemProps) => {
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
    <div
      className={`file-item ${isSelected ? 'selected' : ''}`}
      style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
      onClick={onClick}
    >
      <File size={16} />
      <span className="file-name">{document.name}</span>
      
      {document.processingStatus === 'processing' && (
        <span className="processing-badge">Processing...</span>
      )}

      <div className="file-actions">
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
  );
};

