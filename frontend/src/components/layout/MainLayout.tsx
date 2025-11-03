import { type ReactNode } from 'react';
import { FileText } from 'lucide-react';
import './MainLayout.css';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="main-layout">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <FileText size={32} />
            <h1>AI Document Vault</h1>
          </div>
          <p className="tagline">Intelligent Document Management</p>
        </div>
      </header>
      <main className="main-content">{children}</main>
    </div>
  );
};

