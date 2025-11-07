import type { UploadProgress } from '../../types';
import { UploadProgressItem } from './UploadProgressItem';
import './styles.css';

interface UploadProgressListProps {
  items: UploadProgress[];
}

export const UploadProgressList = ({ items }: UploadProgressListProps) => {
  if (items.length === 0) return null;

  return (
    <div className="upload-progress-list">
      <h3>Upload Progress</h3>
      {items.map((item) => (
        <UploadProgressItem key={item.id} item={item} />
      ))}
    </div>
  );
};

