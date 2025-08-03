import React from 'react';
import { X, Calculator, TrendingUp, ArrowLeftRight, FileUp, FileDown, Settings, User, Bell, Shield, Brain, Sparkles, BarChart } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const toolSections = [
    {
      title: 'Calcolatori',
      icon: Calculator,
      items: [
        { name: 'Calcolatore Tasse', icon: Calculator },
        { name: 'Calcolatore Rendimento', icon: TrendingUp },
        { name: 'Convertitore Valute', icon: ArrowLeftRight }
      ]
    },
    {
      title: 'Import/Export',
      icon: FileUp,
      items: [
        { name: 'Importa CSV', icon: FileUp },
        { name: 'Esporta Excel', icon: FileDown },
        { name: 'Esporta PDF', icon: FileDown }
      ]
    },
    {
      title: 'Impostazioni',
      icon: Settings,
      items: [
        { name: 'Profilo', icon: User },
        { name: 'Notifiche', icon: Bell },
        { name: 'Sicurezza', icon: Shield }
      ]
    },
    {
      title: 'Assistenza AI',
      icon: Brain,
      items: [
        { name: 'Analisi Portafoglio', icon: BarChart },
        { name: 'Previsioni Mercato', icon: Sparkles },
        { name: 'Ottimizzazione Auto', icon: Brain }
      ]
    }
  ];

  return (
    <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Strumenti</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {toolSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-3">
            <div className="flex items-center space-x-2">
              <section.icon size={18} className="text-gray-600" />
              <h3 className="font-semibold text-gray-800">{section.title}</h3>
            </div>
            
            <div className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  className="flex items-center space-x-3 w-full p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                >
                  <item.icon size={18} className="text-gray-500 group-hover:text-blue-600 transition-colors" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;