import { useEffect } from 'react';
import { FileText } from 'lucide-react';
import { DocumentUpload } from './components/DocumentUpload/DocumentUpload';
import { FileExplorer } from './components/FileExplorer/FileExplorer';
import { DocumentViewer } from './components/DocumentViewer/DocumentViewer';
import { useUIStore } from './store/uiStore';
import { documentService } from './services/documentService';
import './App.css';

function App() {
  const error = useUIStore((state) => state.error);

  useEffect(() => {
    documentService.loadData();
  }, []);

  return (
    <div className="main-layout">
      <header className="header">
        <div className="logo">
          <FileText size={32} />
          <h1>AI Document Vault</h1>
        </div>
      </header>
      <main className="main-content">
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
      </main>
    </div>
  );
}

export default App;
