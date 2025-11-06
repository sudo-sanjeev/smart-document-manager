import { Code } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface MarkdownViewProps {
  markdown: string | undefined;
}

export const MarkdownView = ({ markdown }: MarkdownViewProps) => {
  if (!markdown) {
    return (
      <div className="content-markdown">
        <p className="no-content">No markdown version available for this document.</p>
      </div>
    );
  }

  return (
    <div className="content-markdown">
      <div className="markdown-badge">
        <Code size={16} />
        <span>AI Generated Markdown</span>
      </div>
      <div className="markdown-content">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
};

