import { Sparkles } from 'lucide-react';

interface SummaryViewProps {
  summary: string | undefined;
}

export const SummaryView = ({ summary }: SummaryViewProps) => {
  if (!summary) {
    return (
      <div className="content-summary">
        <p className="no-content">No summary available for this document.</p>
      </div>
    );
  }

  return (
    <div className="content-summary">
      <div className="summary-badge">
        <Sparkles size={16} />
        <span>AI Generated Summary</span>
      </div>
      <div className="summary-text">{summary}</div>
    </div>
  );
};

