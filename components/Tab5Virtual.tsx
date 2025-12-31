import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, PieChart } from 'lucide-react';
import { getPosition, toRad } from '../utils';

const RING_RADIUS = 100;
const CENTER = 150;

const Tab5Virtual: React.FC = () => {
  const [useVirtual, setUseVirtual] = useState(false);

  // Simplified scenario: 2 physical nodes.
  // Without virtual: A at 0deg, B at 45deg. 
  // Node B owns 45deg to 360deg (HUGE load). A owns 0 to 45 (Tiny load).
  
  // With virtual: A has tokens at 0, 90, 180, 270. B has tokens at 45, 135, 225, 315.
  // Perfectly interleaved.

  const simpleNodes = [
      { id: 'A', angle: 0, color: '#06b6d4', endAngle: 45 },
      { id: 'B', angle: 45, color: '#a855f7', endAngle: 360 }, // Wraps to 0
  ];

  const virtualNodes = [
      { id: 'A1', angle: 0, color: '#06b6d4' },
      { id: 'B1', angle: 45, color: '#a855f7' },
      { id: 'A2', angle: 90, color: '#06b6d4' },
      { id: 'B2', angle: 135, color: '#a855f7' },
      { id: 'A3', angle: 180, color: '#06b6d4' },
      { id: 'B3', angle: 225, color: '#a855f7' },
      { id: 'A4', angle: 270, color: '#06b6d4' },
      { id: 'B4', angle: 315, color: '#a855f7' },
  ];

  // Calculate arc paths for visualization
  const createArc = (start: number, end: number, color: string) => {
      // SVG arc logic
      // M startX startY A radius radius 0 largeArcFlag sweepFlag endX endY
      const startPos = getPosition(start, RING_RADIUS, CENTER);
      const endPos = getPosition(end, RING_RADIUS, CENTER);
      
      // If end < start (wrapping), add 360 for calculation
      const diff = end < start ? (end + 360) - start : end - start;
      const largeArc = diff > 180 ? 1 : 0;

      return (
          <path
            d={`M ${CENTER} ${CENTER} L ${startPos.x} ${startPos.y} A ${RING_RADIUS} ${RING_RADIUS} 0 ${largeArc} 1 ${endPos.x} ${endPos.y} Z`}
            fill={color}
            stroke="none"
            opacity={0.3}
          />
      );
  };

  return (
    <div className="flex flex-col items-center h-full p-6 space-y-8">
      <div className="text-center max-w-2xl">
        <h2 className="text-2xl font-bold mb-2">Virtual Nodes (The Balancing Act)</h2>
        <p className="text-slate-400">
          Real nodes are rarely evenly spaced. This creates "Hotspots" where one node handles 90% of the traffic.
          <br/>
          <strong>Solution:</strong> Each physical node creates multiple "Virtual Nodes" scattered around the ring.
        </p>
      </div>

      <div className="flex gap-12 items-center">
          <div className="flex flex-col items-center gap-4">
              <div className="relative w-[300px] h-[300px]">
                  <svg width="300" height="300" className="animate-spin-slow">
                        {!useVirtual ? (
                            // Simple Distribution (Bad)
                            <>
                                {createArc(45, 360, '#a855f7')} {/* Node B Load */}
                                {createArc(0, 45, '#06b6d4')}   {/* Node A Load */}
                            </>
                        ) : (
                            // Virtual Distribution (Good)
                            virtualNodes.map((n, i) => {
                                const nextAngle = virtualNodes[(i + 1) % virtualNodes.length].angle;
                                return (
                                    <g key={n.id}>
                                        {createArc(n.angle, nextAngle, n.color)}
                                    </g>
                                )
                            })
                        )}
                        <circle cx={CENTER} cy={CENTER} r={RING_RADIUS} fill="none" stroke="#334155" strokeWidth="2" />
                  </svg>
                  
                  {/* Node Dots */}
                  {(useVirtual ? virtualNodes : simpleNodes).map(n => {
                       const pos = getPosition(n.angle, RING_RADIUS, CENTER);
                       return (
                           <motion.div
                                key={n.id}
                                layoutId={n.id.substring(0,1)} // Shared layout ID attempts to morph A -> A1
                                className="absolute w-4 h-4 rounded-full border border-white z-10 shadow-lg"
                                style={{ backgroundColor: n.color, left: pos.x - 8, top: pos.y - 8 }}
                           >
                               <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white whitespace-nowrap">
                                   {n.id}
                               </span>
                           </motion.div>
                       )
                  })}
              </div>
          </div>

          <div className="flex flex-col gap-6 w-64">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-slate-300 mb-2 border-b border-slate-700 pb-2">Load Distribution</h4>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-cyan-400">Node A Load</span>
                                <span>{useVirtual ? '50%' : '12.5%'}</span>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-2">
                                <motion.div 
                                    className="bg-cyan-500 h-2 rounded-full"
                                    animate={{ width: useVirtual ? '50%' : '12.5%' }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-purple-400">Node B Load</span>
                                <span>{useVirtual ? '50%' : '87.5%'}</span>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-2">
                                <motion.div 
                                    className="bg-purple-500 h-2 rounded-full"
                                    animate={{ width: useVirtual ? '50%' : '87.5%' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setUseVirtual(!useVirtual)}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-4 rounded-lg font-bold transition-all shadow-lg"
                >
                    {useVirtual ? <PieChart size={18}/> : <Layers size={18} />}
                    {useVirtual ? 'Disable Virtual Nodes' : 'Enable Virtual Nodes'}
                </button>
          </div>
      </div>
    </div>
  );
};

export default Tab5Virtual;