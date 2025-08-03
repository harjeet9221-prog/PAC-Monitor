import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Tools from './pages/Tools';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/tools" element={<Tools />} />
          </Routes>
        </MainLayout>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;