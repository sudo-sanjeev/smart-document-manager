import { useState, useEffect } from 'react';
import { FileText, Sparkles, Code } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useDocumentStore } from '../../store/documentStore';
import { useUIStore } from '../../store/uiStore';
import { documentAPI } from '../../service-integration/document-api';
import './styles.css';

type ViewTab = 'original' | 'summary' | 'markdown';

export const DocumentViewer = () => {
  // Selective subscriptions - derived state for selected document
  const documents = useDocumentStore((state) => state.documents);
  const selectedDocumentId = useUIStore((state) => state.selectedDocumentId);
  const setViewMode = useUIStore((state) => state.setViewMode);
  
  const selectedDocument = documents.find((doc) => doc.id === selectedDocumentId) || null;
  const [activeTab, setActiveTab] = useState<ViewTab>('summary');
  const [documentContent, setDocumentContent] = useState<string>('');
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  useEffect(() => {
    if (selectedDocument && activeTab === 'original') {
      loadOriginalContent();
    }
  }, [selectedDocument, activeTab]);

  const loadOriginalContent = async () => {
    if (!selectedDocument) return;

    try {
      setIsLoadingContent(true);
      const blob = await documentAPI.getDocumentContent(selectedDocument.id);
      const text = await blob.text();
      setDocumentContent(text);
    } catch (error) {
      console.error('Error loading document content:', error);
      setDocumentContent('Error loading document content.');
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleTabChange = (tab: ViewTab) => {
    setActiveTab(tab);
    setViewMode(tab);
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

    switch (activeTab) {
      case 'original':
        return (
          <div className="content-original">
            {isLoadingContent ? (
              <div className="loading-content">
                <div className="spinner" />
                <p>Loading document...</p>
              </div>
            ) : (
              <pre className="original-text">{documentContent || 'No content available'}</pre>
            )}
          </div>
        );

      case 'summary':
        return (
          <div className="content-summary">
            {selectedDocument.summary ? (
              <>
                <div className="summary-badge">
                  <Sparkles size={16} />
                  <span>AI Generated Summary</span>
                </div>
                <div className="summary-text">{selectedDocument.summary}</div>
              </>
            ) : (
              <p className="no-content">No summary available for this document.</p>
            )}
          </div>
        );

      case 'markdown':
        return (
          <div className="content-markdown">
            {selectedDocument.markdown ? (
              <>
                <div className="markdown-badge">
                  <Code size={16} />
                  <span>AI Generated Markdown</span>
                </div>
                <div className="markdown-content">
                  <ReactMarkdown>{selectedDocument.markdown}</ReactMarkdown>
                </div>
              </>
            ) : (
              <p className="no-content">No markdown version available for this document.</p>
            )}
          </div>
        );

      default:
        return null;
    }
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

        <div className="view-tabs">
          <button
            className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => handleTabChange('summary')}
          >
            <Sparkles size={16} />
            Summary
          </button>
          <button
            className={`tab ${activeTab === 'markdown' ? 'active' : ''}`}
            onClick={() => handleTabChange('markdown')}
          >
            <Code size={16} />
            Markdown
          </button>
          <button
            className={`tab ${activeTab === 'original' ? 'active' : ''}`}
            onClick={() => handleTabChange('original')}
          >
            <FileText size={16} />
            Original
          </button>
        </div>
      </div>

      <div className="viewer-content">{renderContent()}</div>
    </div>
  );
};

