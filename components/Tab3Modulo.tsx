import React, { useState } from 'react';
import { ArrowRight, Database, AlertOctagon, XCircle, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { simpleHash, toRad } from '../utils';
import { NODE_COLORS } from '../types';

const Tab3Modulo: React.FC = () => {
  const [nodeCount, setNodeCount] = useState(3);
  const [keyInput, setKeyInput] = useState('User:123');
  const [packet, setPacket] = useState<{ active: boolean; targetIndex: number; hash: number } | null>(null);
  const [lastAttempt, setLastAttempt] = useState<{ node: number; success: boolean } | null>(null);

  // We simulate "stored" keys. In reality, we just check if the math matches the initial state
  // Initial state: We assume keys were stored when N=3.
  const storedKeys = new Map<string, number>(); // Key -> Original Node Index
  // Pre-seed the map conceptualy
  // If we calculate hash('User:123') % 3, we get X. We assume it lives there.

  const handleStore = () => {
    const hash = simpleHash(keyInput);
    const targetIndex = hash % nodeCount;
    
    // Check if this is a "retrieval" after a crash
    // For this demo, let's assume we are just visualizing where it goes.
    // If nodeCount is 2 (crashed state), but original owner was node 0 (from N=3),
    // and new target is node 1, that's a MISS.
    
    // Let's simpliy: visualize the math.
    setPacket({ active: true, targetIndex, hash });
    setLastAttempt(null);

    // Reset packet after animation
    setTimeout(() => {
        // Simple logic: if N=2, it's a miss (conceptually, assuming we started with 3)
        const isMiss = nodeCount === 2; 
        setLastAttempt({ node: targetIndex, success: !isMiss });
        setPacket(null);
    }, 1500);
  };

  const toggleCrash = () => {
    setNodeCount((prev) => (prev === 3 ? 2 : 3));
    setPacket(null);
    setLastAttempt(null);
  };

  return (
    <div className="flex flex-col items-center h-full p-6 space-y-6">
       <div className="text-center max-w-2xl">
        <h2 className="text-2xl font-bold mb-2">The Modulo Strategy</h2>
        <p className="text-slate-400 text-sm">
          Route keys using <code className="bg-slate-800 px-1 rounded text-cyan-400">index = hash(key) % N</code>.
          <br/>
          Try storing a key. Then CRASH a node (change N) and see where the math sends the same key.
        </p>
      </div>

      {/* Calculator Input */}
      <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 z-20">
        <div className="flex flex-col">
            <label className="text-xs text-slate-500 font-mono mb-1">KEY</label>
            <input 
                type="text" 
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="bg-slate-900 border border-slate-600 rounded px-3 py-2 font-mono text-white focus:outline-none focus:border-cyan-500 w-40"
            />
        </div>
        <ArrowRight className="text-slate-500" />
        <div className="flex flex-col items-center">
             <span className="text-xs text-slate-500 font-mono">HASH</span>
             <span className="font-mono text-cyan-400">{simpleHash(keyInput)}</span>
        </div>
        <ArrowRight className="text-slate-500" />
        <div className="flex flex-col items-center">
             <span className="text-xs text-slate-500 font-mono">% {nodeCount}</span>
             <span className="font-mono text-xl font-bold text-white">= {simpleHash(keyInput) % nodeCount}</span>
        </div>
        <button 
            onClick={handleStore}
            disabled={!!packet}
            className="ml-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-bold text-sm"
        >
            Find Node
        </button>
      </div>

      {/* Nodes Visualization */}
      <div className="relative w-full max-w-3xl h-64 flex justify-center items-end gap-12 pb-8">
        {[0, 1, 2].map((index) => {
            const isAlive = index < nodeCount;
            return (
                <div key={index} className="relative flex flex-col items-center">
                     {/* Flying Packet */}
                     <AnimatePresence>
                        {packet && packet.active && packet.targetIndex === index && (
                             <motion.div
                                initial={{ y: -150, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ duration: 1, type: "spring" }}
                                className="absolute -top-16 z-20 bg-white text-slate-900 px-3 py-1 rounded shadow-xl border-2 border-cyan-400 font-mono text-xs font-bold whitespace-nowrap"
                             >
                                Data: {keyInput}
                             </motion.div>
                        )}
                     </AnimatePresence>

                     {/* Result Indicator */}
                     <AnimatePresence>
                        {lastAttempt && lastAttempt.node === index && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`absolute -top-24 font-bold text-lg ${lastAttempt.success ? 'text-green-400' : 'text-red-500'} flex flex-col items-center`}
                            >
                                {lastAttempt.success ? 'HIT!' : 'MISS!'}
                                <span className="text-xs font-normal text-slate-400 whitespace-nowrap">
                                    {lastAttempt.success ? 'Correct Node' : 'Wrong Node (Data Lost)'}
                                </span>
                            </motion.div>
                        )}
                     </AnimatePresence>

                    <div className={`w-24 h-32 rounded-lg flex flex-col items-center justify-center border-2 transition-all duration-300 ${
                        isAlive 
                        ? `${NODE_COLORS[index]} bg-opacity-20` 
                        : 'bg-slate-800 border-slate-700 opacity-50 grayscale'
                    }`}>
                        {isAlive ? <Server size={32} /> : <XCircle size={32} />}
                        <span className="mt-2 font-bold">Node {index}</span>
                    </div>
                </div>
            );
        })}
      </div>

      <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-center max-w-lg">
          <button 
            onClick={toggleCrash}
            className={`px-6 py-2 rounded font-bold transition-colors ${nodeCount === 3 ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
          >
              {nodeCount === 3 ? '💥 SIMULATE CRASH (Remove Node 2)' : '↺ RESTORE NODE 2'}
          </button>
          <p className="mt-3 text-xs text-slate-400">
              When N changes from 3 to 2, <b>nearly all keys</b> remap to different locations because the modulo divisor changes. This causes a massive cache stampede on the database.
          </p>
      </div>
    </div>
  );
};

export default Tab3Modulo;