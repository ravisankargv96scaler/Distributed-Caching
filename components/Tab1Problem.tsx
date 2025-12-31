import React, { useState } from 'react';
import { Server, Database, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const Tab1Problem: React.FC = () => {
  const [usedRam, setUsedRam] = useState(0);
  const maxRam = 10;

  const handleAddData = () => {
    setUsedRam((prev) => prev + 5);
  };

  const handleReset = () => {
    setUsedRam(0);
  };

  const isOverflow = usedRam > maxRam;
  const percentage = Math.min((usedRam / maxRam) * 100, 100);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 p-6">
      <div className="text-center max-w-2xl">
        <h2 className="text-2xl font-bold mb-2">The Single Node Bottleneck</h2>
        <p className="text-slate-400">
          A traditional local cache is fast but limited by the physical hardware of a single machine.
          What happens when your data grows beyond 100%?
        </p>
      </div>

      <div className="relative w-64 h-80 bg-slate-800 rounded-xl border-2 border-slate-700 flex flex-col items-center justify-end p-4 shadow-2xl overflow-hidden">
        {/* Server Icon */}
        <div className="absolute top-4 text-slate-500">
          <Server size={48} />
        </div>
        
        {/* Capacity Label */}
        <div className="absolute top-16 text-xs font-mono text-slate-400">
          Local Cache (Max {maxRam}GB)
        </div>

        {/* Liquid Fill Animation */}
        <div className="w-24 h-48 bg-slate-900 rounded-lg border border-slate-600 relative overflow-hidden mb-4 z-10">
          <motion.div 
            className={`absolute bottom-0 left-0 right-0 transition-colors duration-500 ${
              isOverflow ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            initial={{ height: '0%' }}
            animate={{ height: `${percentage}%` }}
            transition={{ type: 'spring', stiffness: 60 }}
          />
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-rows-4 divide-y divide-slate-700/50 pointer-events-none">
            <div></div><div></div><div></div><div></div>
          </div>
        </div>

        {/* Status Text */}
        <div className="z-10 font-mono font-bold text-lg">
          {usedRam}GB / {maxRam}GB
        </div>

        {/* Explosion Overlay */}
        {isOverflow && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center text-center z-20 backdrop-blur-sm"
          >
            <AlertTriangle size={64} className="text-red-500 mb-2 animate-bounce" />
            <h3 className="text-xl font-bold text-white">SYSTEM CRASH!</h3>
            <p className="text-red-200 text-sm mt-2 px-4">Out of Memory Exception.</p>
            <button 
              onClick={handleReset}
              className="mt-4 px-4 py-2 bg-white text-red-900 rounded-full font-bold text-sm hover:bg-red-100"
            >
              Reboot System
            </button>
          </motion.div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleAddData}
          disabled={isOverflow}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-blue-900/20"
        >
          <Database size={20} />
          Add 5GB Data
        </button>
      </div>
    </div>
  );
};

export default Tab1Problem;