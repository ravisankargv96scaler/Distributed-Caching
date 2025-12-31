import React, { useState } from 'react';
import { Server, Plus, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NODE_COLORS } from '../types';

const Tab2Cluster: React.FC = () => {
  const [nodes, setNodes] = useState<number[]>([]);
  
  const addNode = () => {
    if (nodes.length < 5) {
      setNodes([...nodes, nodes.length]);
    }
  };

  const reset = () => setNodes([]);

  const totalCapacity = nodes.length * 10;

  return (
    <div className="flex flex-col items-center h-full p-6 space-y-8">
      <div className="text-center max-w-2xl">
        <h2 className="text-2xl font-bold mb-2">The Cluster Approach</h2>
        <p className="text-slate-400">
          We can combine RAM from multiple machines into one big logical cache. 
          Total Capacity = Sum(Node Capacities).
        </p>
      </div>

      {/* Main Visualization Area */}
      <div className="w-full max-w-4xl bg-slate-900/50 rounded-xl p-8 border border-slate-800 min-h-[300px] flex flex-col items-center justify-center relative">
        
        {nodes.length === 0 && (
          <div className="text-slate-600 italic">No nodes in cluster. Add one to start.</div>
        )}

        <div className="flex flex-wrap justify-center gap-6 z-10">
          <AnimatePresence>
            {nodes.map((id, index) => (
              <motion.div
                key={id}
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0 }}
                className={`w-32 h-40 ${NODE_COLORS[index % NODE_COLORS.length]} bg-opacity-20 border-2 rounded-xl flex flex-col items-center justify-center relative backdrop-blur-sm`}
              >
                <Server size={32} className="mb-2 opacity-80" />
                <span className="font-bold text-lg">Node {String.fromCharCode(65 + index)}</span>
                <span className="text-xs font-mono mt-1 opacity-70">10GB RAM</span>
                
                {/* Connecting Lines Hint */}
                {index > 0 && (
                  <div className="absolute -left-6 top-1/2 w-6 h-1 bg-slate-700 -z-10" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Total Capacity Counter */}
        <div className="absolute bottom-4 right-4 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
          <span className="text-slate-400 text-sm uppercase tracking-wider">Total Pool: </span>
          <span className="text-2xl font-mono font-bold text-emerald-400">
            {totalCapacity} GB
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={addNode}
          disabled={nodes.length >= 5}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all"
        >
          <Plus size={20} />
          Add Cache Node
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
        >
          <RefreshCw size={20} />
          Reset
        </button>
      </div>
    </div>
  );
};

export default Tab2Cluster;