import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Tools from './pages/Tools';
import './App.css';

// Simple test component to verify basic functionality
const TestComponent = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold text-blue-600">PAC Monitor Test</h1>
    <p className="mt-2">App is working correctly!</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/test" element={<TestComponent />} />
          </Routes>
        </MainLayout>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;