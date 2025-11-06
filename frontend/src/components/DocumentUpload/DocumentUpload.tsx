import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useUploadStore } from '../../store/uploadStore';
import { useUIStore } from '../../store/uiStore';
import { documentService } from '../../services/documentService';
import './styles.css';

export const DocumentUpload = () => {
  const uploadProgress = useUploadStore((state) => state.uploadProgress);
  const selectedFolderId = useUIStore((state) => state.selectedFolderId);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        try {
          await documentService.uploadFiles(acceptedFiles, selectedFolderId || undefined);
        } catch (error) {
          console.error('Upload error:', error);
        }
      }
    },
    [selectedFolderId]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
    },
    multiple: true,
  });

  return (
    <div className="document-upload">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'drag-active' : ''} ${
          isDragReject ? 'drag-reject' : ''
        }`}
      >
        <input {...getInputProps()} />
        <Upload size={48} className="upload-icon" />
        {isDragActive ? (
          <p className="dropzone-text">Drop the files here...</p>
        ) : isDragReject ? (
          <p className="dropzone-text error">
            Some files are not supported. Please upload PDF, DOC, DOCX, TXT, or MD files.
          </p>
        ) : (
          <>
            <p className="dropzone-text">
              Drag & drop documents here, or click to select files
            </p>
            <p className="dropzone-hint">
              Supported formats: PDF, DOC, DOCX, TXT, MD
            </p>
          </>
        )}
      </div>

      {uploadProgress.length > 0 && (
        <div className="upload-progress-list">
          <h3>Upload Progress</h3>
          {uploadProgress.map((item) => (
            <div key={item.filename} className="upload-item">
              <div className="upload-item-header">
                <File size={20} />
                <span className="filename">{item.filename}</span>
                <span className="status-icon">
                  {item.status === 'uploading' && <Loader size={16} className="spin" />}
                  {item.status === 'processing' && <Loader size={16} className="spin" />}
                  {item.status === 'completed' && <CheckCircle size={16} className="success" />}
                  {item.status === 'failed' && <AlertCircle size={16} className="error" />}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-fill ${item.status}`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <div className="status-text">
                {item.status === 'uploading' && 'Uploading...'}
                {item.status === 'processing' && 'AI Processing...'}
                {item.status === 'completed' && 'Complete!'}
                {item.status === 'failed' && (item.error || 'Failed')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

