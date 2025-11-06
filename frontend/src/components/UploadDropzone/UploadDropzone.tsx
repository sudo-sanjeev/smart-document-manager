import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import './styles.css';

interface UploadDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFileTypes?: Record<string, string[]>;
  multiple?: boolean;
  disabled?: boolean;
}

const DEFAULT_ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
  'text/markdown': ['.md'],
};

export const UploadDropzone = ({
  onFilesSelected,
  acceptedFileTypes = DEFAULT_ACCEPTED_TYPES,
  multiple = true,
  disabled = false,
}: UploadDropzoneProps) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: onFilesSelected,
    accept: acceptedFileTypes,
    multiple,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? 'drag-active' : ''} ${
        isDragReject ? 'drag-reject' : ''
      } ${disabled ? 'disabled' : ''}`}
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
  );
};

