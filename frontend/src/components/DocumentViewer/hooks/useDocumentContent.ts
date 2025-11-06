import { useState, useEffect } from 'react';
import { documentService } from '../../../services/documentService';
import type { DocumentType } from '../../../types';

interface DocumentContent {
  content: string;
  blobUrl: string | null;
  isLoading: boolean;
  error: string | null;
  isPDF: boolean;
}

export const useDocumentContent = (document: DocumentType | null, shouldLoad: boolean): DocumentContent => {
  const [content, setContent] = useState<string>('');
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPDF = !!(document?.type === 'application/pdf' || document?.name.toLowerCase().endsWith('.pdf'));

  useEffect(() => {
    if (!document || !shouldLoad) {
      setContent('');
      setBlobUrl(null);
      setError(null);
      return;
    }

    const loadContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const blob = await documentService.getDocumentContent(document.id);
        
        if (isPDF) {
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
          setContent('');
        } else {
          const text = await blob.text();
          setContent(text);
          setBlobUrl(null);
        }
      } catch (err) {
        console.error('Error loading document content:', err);
        setError('Error loading document content.');
        setContent('');
        setBlobUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [document?.id, shouldLoad, isPDF]);

  return { content, blobUrl, isLoading, error, isPDF };
};

