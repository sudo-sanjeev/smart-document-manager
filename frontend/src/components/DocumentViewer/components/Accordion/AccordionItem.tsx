import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { useAccordion } from './Accordion';

interface AccordionItemProps {
  id: string;
  title: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  disabled?: boolean;
}

export const AccordionItem = ({ 
  id, 
  title, 
  icon, 
  children, 
  disabled = false 
}: AccordionItemProps) => {
  const { openItems, toggleItem } = useAccordion();
  const isOpen = openItems.includes(id);

  const handleToggle = () => {
    if (!disabled) {
      toggleItem(id);
    }
  };

  return (
    <div className={`accordion-item ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}>
      <button
        className="accordion-header"
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isOpen}
      >
        <div className="accordion-title">
          {icon && <span className="accordion-icon">{icon}</span>}
          <span>{title}</span>
        </div>
        <ChevronDown 
          size={20} 
          className={`accordion-chevron ${isOpen ? 'rotated' : ''}`}
        />
      </button>
      
      {isOpen && (
        <div className="accordion-content">
          {children}
        </div>
      )}
    </div>
  );
};

