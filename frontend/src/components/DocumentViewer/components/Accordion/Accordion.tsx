import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (id: string) => void;
  allowMultiple: boolean;
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);

export const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('useAccordion must be used within an Accordion');
  }
  return context;
};

interface AccordionProps {
  children: ReactNode;
  defaultOpen?: string[];
  allowMultiple?: boolean;
  className?: string;
  onChange?: (openItems: string[]) => void;
}

export const Accordion = ({ 
  children, 
  defaultOpen = [], 
  allowMultiple = false,
  className = '',
  onChange
}: AccordionProps) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const isOpen = prev.includes(id);
      let newItems: string[];
      
      if (isOpen) {
        newItems = prev.filter((item) => item !== id);
      } else if (allowMultiple) {
        newItems = [...prev, id];
      } else {
        newItems = [id];
      }
      
      onChange?.(newItems);
      return newItems;
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, allowMultiple }}>
      <div className={`accordion ${className}`}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

