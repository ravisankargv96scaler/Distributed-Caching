import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Key as KeyIcon } from 'lucide-react';
import { NODE_COLORS, RING_COLORS, Node, KeyItem } from '../types';
import { getPosition, simpleHash, findOwnerNode } from '../utils';

const RING_RADIUS = 120;
const CENTER = 150;

const Tab4Consistent: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'A', name: 'Node A', color: RING_COLORS[0], angle: 0 },
    { id: 'B', name: 'Node B', color: RING_COLORS[1], angle: 120 },
    { id: 'C', name: 'Node C', color: RING_COLORS[2], angle: 240 },
  ]);

  const [keys, setKeys] = useState<KeyItem[]>([]);

  const addKey = () => {
    const id = Math.random().toString(36).substr(2, 5);
    // Random angle for demo purposes, or hashed angle
    const angle = Math.floor(Math.random() * 360);
    const newKey = { id, val: `Key-${id}`, hash: angle, angle };
    setKeys((prev) => [...prev, newKey]);
  };

  const addNode = () => {
    if (nodes.length >= 5) return;
    const nextIdChar = String.fromCharCode(65 + nodes.length);
    // Place new node at a random spot or specifically between others to show rebalancing
    // Let's place it at 60 degrees (Between A(0) and B(120))
    const angle = 60 + (nodes.length - 3) * 30; 
    
    setNodes((prev) => [
      ...prev,
      { 
        id: nextIdChar, 
        name: `Node ${nextIdChar}`, 
        color: RING_COLORS[nodes.length % RING_COLORS.length], 
        angle 
      }
    ]);
  };

  const removeNode = (id: string) => {
      setNodes(prev => prev.filter(n => n.id !== id));
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Controls */}
      <div className="w-full md:w-1/3 p-6 border-r border-slate-800 flex flex-col gap-6">
        <div>
            <h3 className="font-bold text-xl mb-2 text-cyan-400">Consistent Hashing</h3>
            <p className="text-sm text-slate-400">
                Nodes and Keys are placed on the same ring (0°-360°).
                <br/><br/>
                A Key belongs to the <b>first node found moving clockwise</b>.
            </p>
        </div>

        <div className="space-y-3">
             <div className="flex justify-between items-center">
                 <span className="font-mono text-sm font-bold">NODES: {nodes.length}</span>
                 <button 
                    onClick={addNode} 
                    disabled={nodes.length >= 5}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-600 disabled:opacity-50"
                 >
                     <Plus size={16} />
                 </button>
             </div>
             <div className="space-y-2">
                 {nodes.map(n => (
                     <div key={n.id} className="flex items-center justify-between text-xs bg-slate-900 p-2 rounded border border-slate-800">
                         <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full" style={{ backgroundColor: n.color }}></div>
                             <span>{n.name} ({n.angle}°)</span>
                         </div>
                         {nodes.length > 1 && (
                            <button onClick={() => removeNode(n.id)} className="text-slate-600 hover:text-red-400">
                                <Trash2 size={14} />
                            </button>
                         )}
                     </div>
                 ))}
             </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
            <button 
                onClick={addKey}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold text-white shadow-lg shadow-blue-900/20"
            >
                <KeyIcon size={18} />
                Add Random Key
            </button>
            <div className="mt-2 text-xs text-slate-500 text-center">
                Watch how keys automatically re-assign!
            </div>
        </div>
      </div>

      {/* Visualizer */}
      <div className="w-full md:w-2/3 bg-slate-950 flex flex-col items-center justify-center p-8 relative overflow-hidden">
         {/* Background Grid */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

         <div className="relative w-[300px] h-[300px]">
             {/* The Ring */}
             <svg width="300" height="300" className="absolute inset-0 overflow-visible">
                 <circle cx={CENTER} cy={CENTER} r={RING_RADIUS} fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                 
                 {/* Key Paths (Optional: Draw lines from key to node) */}
                 {keys.map(k => {
                     const owner = findOwnerNode(k.angle!, nodes);
                     if (!owner) return null;
                     const keyPos = getPosition(k.angle!, RING_RADIUS - 20, CENTER);
                     const nodePos = getPosition(owner.angle!, RING_RADIUS, CENTER);
                     return (
                         <motion.line
                            key={`line-${k.id}-${owner.id}`}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.3 }}
                            x1={keyPos.x} y1={keyPos.y}
                            x2={nodePos.x} y2={nodePos.y}
                            stroke={owner.color}
                            strokeWidth="1"
                         />
                     )
                 })}
             </svg>

             {/* Nodes */}
             <AnimatePresence>
                 {nodes.map(node => {
                     const pos = getPosition(node.angle!, RING_RADIUS, CENTER);
                     return (
                         <motion.div
                            key={node.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, x: pos.x - 20, y: pos.y - 20 }}
                            exit={{ scale: 0 }}
                            className="absolute w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shadow-[0_0_15px_rgba(0,0,0,0.5)] border-2 border-white z-20 cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: node.color }}
                         >
                             {node.id}
                         </motion.div>
                     )
                 })}
             </AnimatePresence>

             {/* Keys */}
             {keys.map(k => {
                 const pos = getPosition(k.angle!, RING_RADIUS - 20, CENTER);
                 const owner = findOwnerNode(k.angle!, nodes);
                 return (
                     <motion.div
                        key={k.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                            scale: 1, 
                            opacity: 1,
                            x: pos.x - 6,
                            y: pos.y - 6,
                            backgroundColor: owner ? owner.color : '#94a3b8'
                        }}
                        className="absolute w-3 h-3 rounded-full border border-slate-900 z-10"
                     />
                 )
             })}
         </div>

         {/* Legend for stability */}
         <AnimatePresence>
            {nodes.length > 3 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-6 bg-slate-900/80 backdrop-blur border border-emerald-500/50 text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold shadow-xl"
                >
                    Notice: Adding Node D only moved keys near it!
                </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
};

export default Tab4Consistent;