interface OriginalViewProps {
  content: string;
  blobUrl: string | null;
  isLoading: boolean;
  error: string | null;
  isPDF: boolean;
}

export const OriginalView = ({ content, blobUrl, isLoading, error, isPDF }: OriginalViewProps) => {
  if (isLoading) {
    return (
      <div className="content-original">
        <div className="loading-content">
          <div className="spinner" />
          <p>Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-original">
        <pre className="original-text">{error}</pre>
      </div>
    );
  }

  // Render PDF using iframe
  if (isPDF && blobUrl) {
    return (
      <div className="content-original pdf-viewer">
        <iframe
          src={blobUrl}
          title="PDF Document"
          className="pdf-iframe"
        />
      </div>
    );
  }

  // Render text content
  return (
    <div className="content-original">
      <pre className="original-text">{content || 'No content available'}</pre>
    </div>
  );
};

