import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { VaultPage } from './pages/VaultPage';
import './App.css';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<VaultPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
