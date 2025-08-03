import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart3, PieChart, Wrench } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      label: 'Mercato',
      icon: BarChart3,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      path: '/portfolio',
      label: 'Portafoglio',
      icon: PieChart,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      path: '/tools',
      label: 'Strumenti',
      icon: Wrench,
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      <div className="bg-white/80 backdrop-blur-lg border-t border-gray-200/50 shadow-lg">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map(({ path, label, icon: Icon, gradient }) => {
            const isActive = location.pathname === path;
            
            return (
              <button
                key={path}
                onClick={() => handleNavigation(path)}
                className={`flex flex-col items-center space-y-1 py-3 px-4 rounded-xl transition-all duration-300 ${
                  isActive ? 'transform -translate-y-1' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? `bg-gradient-to-r ${gradient} shadow-lg` 
                    : 'bg-gray-100'
                }`}>
                  <Icon 
                    size={20} 
                    className={isActive ? 'text-white' : 'text-gray-600'}
                  />
                </div>
                <span className={`text-xs font-medium transition-colors ${
                  isActive ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;