import React, { useEffect, useState } from 'react';
import { VisualState } from '../types.ts';
import { Zap, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';

interface VisualizerProps {
  state: VisualState;
  machineName: string;
}

const Visualizer: React.FC<VisualizerProps> = ({ state, machineName }) => {
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (state === 'UNSTABLE') {
      const interval = setInterval(() => {
        const id = Date.now();
        const x = Math.random() * 80 + 10; // 10% to 90%
        const y = Math.random() * 80 + 10;
        setSparks((prev) => [...prev.slice(-4), { id, x, y }]);
      }, 600);
      return () => clearInterval(interval);
    } else {
      setSparks([]);
    }
  }, [state]);

  const isUnstable = state === 'UNSTABLE';
  const isStable = state === 'STABLE';

  return (
    <div className="relative w-full h-64 md:h-full bg-slate-900 rounded-xl border-4 border-slate-700 overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]">
        {/* Scanline Overlay */}
        <div className="scanline"></div>

        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        {/* Main Machine Graphic */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ${isUnstable ? 'animate-flicker' : ''}`}>
           
           {/* Status Light */}
           <div className={`absolute top-4 right-4 w-4 h-4 rounded-full shadow-[0_0_10px_currentColor] transition-colors duration-500 ${
             isUnstable ? 'bg-red-500 text-red-500' : 'bg-emerald-400 text-emerald-400'
           }`}></div>

           <div className={`relative p-8 rounded-full border-4 transition-all duration-700 ${
             isUnstable 
               ? 'border-red-500/50 bg-red-900/20 animate-shake' 
               : 'border-emerald-500/50 bg-emerald-900/20 scale-110'
           }`}>
              {isUnstable ? (
                <AlertTriangle size={80} className="text-red-500" />
              ) : (
                <CheckCircle2 size={80} className="text-emerald-400 shadow-[0_0_20px_currentColor]" />
              )}
           </div>
           
           <h3 className={`mt-6 text-xl font-mono font-bold tracking-widest uppercase transition-colors ${
             isUnstable ? 'text-red-400' : 'text-emerald-400'
           }`}>
             {machineName}
           </h3>
           
           <p className="text-slate-500 font-mono text-xs mt-2">
             STATUS: {state}
           </p>
        </div>

        {/* Sparks Layer */}
        {sparks.map((spark) => (
          <div
            key={spark.id}
            className="absolute pointer-events-none"
            style={{ left: `${spark.x}%`, top: `${spark.y}%` }}
          >
            <Zap size={24} className="text-yellow-300 fill-yellow-100 animate-ping" />
          </div>
        ))}

        {/* Stabilizing Effect */}
        {state === 'STABILIZING' && (
          <div className="absolute inset-0 bg-emerald-500/20 animate-pulse pointer-events-none"></div>
        )}
    </div>
  );
};

export default Visualizer;