import { UploadDropzone } from './UploadDropzone/UploadDropzone';
import { UploadProgressList } from './UploadProgressList/UploadProgressList';
import { useFileUpload } from './hooks/useFileUpload';
import './styles.css';

export const DocumentUpload = () => {
  const { uploadFiles, uploadProgress, isUploading } = useFileUpload();

  return (
    <div className="document-upload">
      <UploadDropzone 
        onFilesSelected={uploadFiles}
        disabled={isUploading}
      />
      <UploadProgressList items={uploadProgress} />
    </div>
  );
};
