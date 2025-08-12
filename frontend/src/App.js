import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Tools from './pages/Tools';
import Markets from './pages/Markets';
import News from './pages/News';
import AssetDetail from './pages/AssetDetail';
import PortfolioBuilder from './pages/PortfolioBuilder';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/builder" element={<PortfolioBuilder />} />
            <Route path="/asset/:id" element={<AssetDetail />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/news" element={<News />} />
          </Routes>
        </MainLayout>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;