import { FileText } from 'lucide-react';
import { useDocumentStore } from '../../store/documentStore';
import { useUIStore } from '../../store/uiStore';
import { DocumentAccordion } from './components/DocumentAccordion';
import './styles.css';

export const DocumentViewer = () => {
  const documents = useDocumentStore((state) => state.documents);
  const selectedDocumentId = useUIStore((state) => state.selectedDocumentId);
  const setViewMode = useUIStore((state) => state.setViewMode);

  const selectedDocument = documents.find((doc) => doc.id === selectedDocumentId) || null;

  const handleViewChange = (view: string) => {
    setViewMode(view as 'original' | 'summary' | 'markdown');
  };

  if (!selectedDocument) {
    return (
      <div className="document-viewer empty">
        <div className="empty-state">
          <FileText size={64} className="empty-icon" />
          <h3>No Document Selected</h3>
          <p>Select a document from the file explorer to view its contents</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (selectedDocument.processingStatus === 'processing') {
      return (
        <div className="processing-state">
          <div className="spinner" />
          <h3>AI Processing...</h3>
          <p>Generating summary and markdown version</p>
        </div>
      );
    }

    if (selectedDocument.processingStatus === 'failed') {
      return (
        <div className="error-state">
          <h3>Processing Failed</h3>
          <p>Unable to process this document with AI</p>
        </div>
      );
    }

    return (
      <DocumentAccordion 
        document={selectedDocument} 
        onViewChange={handleViewChange}
      />
    );
  };

  return (
    <div className="document-viewer">
      <div className="viewer-header">
        <div className="document-info">
          <h2>{selectedDocument.name}</h2>
          <div className="document-meta">
            <span className="meta-item">
              {(selectedDocument.size / 1024).toFixed(2)} KB
            </span>
            <span className="meta-item">{selectedDocument.type}</span>
            <span className="meta-item">
              {new Date(selectedDocument.uploadedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="viewer-content">{renderContent()}</div>
    </div>
  );
};

