import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { VaultPage } from './pages/VaultPage';
import './App.css';

function App() {
  return (
    <Router>
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
      <main className="main-content">
        <Routes>
          <Route path="/" element={<VaultPage />} />
        </Routes>
      </main>
    </div>
    </Router>
  );
}

export default App;
