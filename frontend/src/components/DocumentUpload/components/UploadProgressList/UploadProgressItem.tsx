import { memo } from 'react';
import { File as FileIcon, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import type { UploadProgress } from '../../../../types';

interface UploadProgressItemProps {
  item: UploadProgress;
}

const getStatusIcon = (status: UploadProgress['status']) => {
  switch (status) {
    case 'uploading':
    case 'processing':
      return <Loader size={16} className="spin" />;
    case 'completed':
      return <CheckCircle size={16} className="success" />;
    case 'failed':
      return <AlertCircle size={16} className="error" />;
    default:
      return null;
  }
};

const getStatusText = (item: UploadProgress) => {
  switch (item.status) {
    case 'uploading':
      return 'Uploading...';
    case 'processing':
      return 'AI Processing...';
    case 'completed':
      return 'Complete!';
    case 'failed':
      return item.error || 'Failed';
    default:
      return '';
  }
};

export const UploadProgressItem = memo(({ item }: UploadProgressItemProps) => {
  return (
    <div className="upload-item">
      <div className="upload-item-header">
        <FileIcon size={20} />
        <span className="filename">{item.filename}</span>
        <span className="status-icon">{getStatusIcon(item.status)}</span>
      </div>
      <div className="progress-bar">
        <div
          className={`progress-fill ${item.status}`}
          style={{ width: `${item.progress || 0}%` }}
        />
      </div>
      <div className="status-text">{getStatusText(item)}</div>
    </div>
  );
});

UploadProgressItem.displayName = 'UploadProgressItem';

