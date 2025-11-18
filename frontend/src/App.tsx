import { useEffect } from 'react';
import { FileText } from 'lucide-react';
import { DocumentUpload } from './components/DocumentUpload/DocumentUpload';
import { FileExplorer } from './components/FileExplorer/FileExplorer';
import { DocumentViewer } from './components/DocumentViewer/DocumentViewer';
import { ToastContainer } from './components/Toast/ToastContainer';
import { documentService } from './services/documentService';
import './App.css';

function App() {
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
      <ToastContainer />
    </div>
  );
}

export default App;
