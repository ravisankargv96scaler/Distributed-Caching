import React from 'react';
import { TabId } from '../types';
import { Server, Grid, Calculator, Disc, Share2, Award } from 'lucide-react';

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: TabId; label: string; icon: React.FC<any> }[] = [
    { id: 'problem', label: 'The Problem', icon: Server },
    { id: 'cluster', label: 'Cluster', icon: Grid },
    { id: 'modulo', label: 'Modulo Hashing', icon: Calculator },
    { id: 'consistent', label: 'Consistent Hashing', icon: Disc },
    { id: 'virtual', label: 'Virtual Nodes', icon: Share2 },
    { id: 'quiz', label: 'Quiz', icon: Award },
  ];

  return (
    <div className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 flex md:flex-col overflow-x-auto md:overflow-x-visible">
      <div className="p-6 hidden md:block">
        <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          CacheMaster
        </h1>
        <p className="text-xs text-slate-500 mt-1">Distributed Systems Interactive</p>
      </div>
      
      <nav className="flex-1 p-2 md:p-4 space-x-2 md:space-x-0 md:space-y-2 flex md:flex-col">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all w-full whitespace-nowrap md:whitespace-normal
                ${isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                }`}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-6 hidden md:block border-t border-slate-800">
          <div className="text-xs text-slate-600">
              v1.0.0 &bull; React & Tailwind
          </div>
      </div>
    </div>
  );
};

export default TabNavigation;