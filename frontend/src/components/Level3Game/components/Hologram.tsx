import React from 'react';
import { MessageSquare } from 'lucide-react';

interface HologramProps {
  message: string;
  isActive: boolean;
}

const Hologram: React.FC<HologramProps> = ({ message, isActive }) => {
  return (
    <div className={`absolute top-4 right-4 z-20 max-w-xs transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-cyan-950/90 border border-cyan-500 rounded-lg p-4 shadow-[0_0_20px_rgba(6,182,212,0.2)] backdrop-blur-md relative">
        {/* Speech Bubble Tail */}
        <div className="absolute -bottom-2 right-8 w-4 h-4 bg-cyan-950 border-r border-b border-cyan-500 transform rotate-45"></div>
        
        <div className="flex gap-3 items-start">
          <div className="w-10 h-10 rounded-full bg-cyan-900 border border-cyan-400 flex items-center justify-center shrink-0 relative overflow-hidden">
             <div className="w-full h-full bg-[url('https://picsum.photos/100/100')] bg-cover opacity-50 mix-blend-luminosity"></div>
             <div className="absolute inset-0 bg-cyan-500/20 animate-pulse"></div>
          </div>
          <div>
            <h4 className="text-cyan-400 text-xs font-bold uppercase mb-1 tracking-wider">Reactor AI</h4>
            <p className="text-cyan-100 text-sm font-mono leading-tight">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hologram;