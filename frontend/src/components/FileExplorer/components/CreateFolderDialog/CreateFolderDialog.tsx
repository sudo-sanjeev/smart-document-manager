import { useRef, useEffect } from 'react';

interface CreateFolderDialogProps {
  folderName: string;
  onFolderNameChange: (name: string) => void;
  onCreate: () => void;
  onCancel: () => void;
}

export const CreateFolderDialog = ({
  folderName,
  onFolderNameChange,
  onCreate,
  onCancel,
}: CreateFolderDialogProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onCreate();
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div className="new-folder-input">
      <input
        ref={inputRef}
        type="text"
        placeholder="Folder name"
        value={folderName}
        onChange={(e) => onFolderNameChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={onCreate} className="btn-primary">
        Create
      </button>
      <button onClick={onCancel} className="btn-secondary">
        Cancel
      </button>
    </div>
  );
};

