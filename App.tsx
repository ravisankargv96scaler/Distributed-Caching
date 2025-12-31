import React, { useState } from 'react';
import TabNavigation from './components/TabNavigation';
import { TabId } from './types';
import Tab1Problem from './components/Tab1Problem';
import Tab2Cluster from './components/Tab2Cluster';
import Tab3Modulo from './components/Tab3Modulo';
import Tab4Consistent from './components/Tab4Consistent';
import Tab5Virtual from './components/Tab5Virtual';
import Tab6Quiz from './components/Tab6Quiz';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('problem');

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Navigation Sidebar */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
             style={{ 
                 backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', 
                 backgroundSize: '40px 40px' 
             }} 
        />
        
        <div className="relative z-10 h-full">
            {activeTab === 'problem' && <Tab1Problem />}
            {activeTab === 'cluster' && <Tab2Cluster />}
            {activeTab === 'modulo' && <Tab3Modulo />}
            {activeTab === 'consistent' && <Tab4Consistent />}
            {activeTab === 'virtual' && <Tab5Virtual />}
            {activeTab === 'quiz' && <Tab6Quiz />}
        </div>
      </main>
    </div>
  );
}