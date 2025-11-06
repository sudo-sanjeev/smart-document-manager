import { Sparkles, Code, FileText } from 'lucide-react';
import type { DocumentType } from '../../../types';
import { Accordion } from './Accordion/Accordion';
import { AccordionItem } from './Accordion/AccordionItem';
import { OriginalView } from './Accordion/views/OriginalView';
import { SummaryView } from './Accordion/views/SummaryView';
import { MarkdownView } from './Accordion/views/MarkdownView';
import { useDocumentContent } from '../hooks/useDocumentContent';

interface DocumentAccordionProps {
  document: DocumentType;
  onViewChange?: (view: string) => void;
}

export const DocumentAccordion = ({ document, onViewChange }: DocumentAccordionProps) => {
  const { content, blobUrl, isLoading, error, isPDF } = useDocumentContent(document, true);

  const isProcessing = document.processingStatus === 'processing';
  const hasFailed = document.processingStatus === 'failed';

  const handleAccordionChange = (openItems: string[]) => {
    if (openItems.length > 0) {
      onViewChange?.(openItems[0]);
    }
  };

  return (
    <Accordion 
      defaultOpen={['summary']} 
      allowMultiple={false}
      className="document-accordion"
      onChange={handleAccordionChange}
    >
      <AccordionItem
        id="summary"
        title="AI Generated Summary"
        icon={<Sparkles size={18} />}
        disabled={isProcessing || hasFailed}
      >
        <SummaryView summary={document.summary} />
      </AccordionItem>

      <AccordionItem
        id="markdown"
        title="Markdown Version"
        icon={<Code size={18} />}
        disabled={isProcessing || hasFailed}
      >
        <MarkdownView markdown={document.markdown} />
      </AccordionItem>

      <AccordionItem
        id="original"
        title="Original Content"
        icon={<FileText size={18} />}
      >
        <OriginalView 
          content={content} 
          blobUrl={blobUrl}
          isLoading={isLoading} 
          error={error}
          isPDF={isPDF}
        />
      </AccordionItem>
    </Accordion>
  );
};

