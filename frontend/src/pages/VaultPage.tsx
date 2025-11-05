import { DocumentUpload } from '../components/DocumentUpload/DocumentUpload';
import { FileExplorer } from '../components/FileExplorer/FileExplorer';
import { DocumentViewer } from '../components/DocumentViewer/DocumentViewer';
import { useDocuments } from '../hooks/useDocuments';
import './VaultPage.css';

export const VaultPage = () => {
  const { error } = useDocuments();

  return (
    <div className="vault-page">
      <div className="vault-container">
        <div className="upload-section">
          <DocumentUpload />
        </div>

        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="vault-main">
          <div className="sidebar">
            <FileExplorer />
          </div>
          <div className="content-area">
            <DocumentViewer />
          </div>
        </div>
      </div>
    </div>
  );
};

