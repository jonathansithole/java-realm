import React, { useEffect, useState } from 'react';
import { VisualState } from '../types.ts';
import { Sparkles, Zap, ArrowUpCircle } from 'lucide-react';

interface VisualizerProps {
  state: VisualState;
  currentChallengeId: number;
  isPaused: boolean;
}

export const Visualizer: React.FC<VisualizerProps> = ({ state, currentChallengeId, isPaused }) => {
  
  // Door Logic
  const doorClass = state.doorOpen 
    ? "animate-creak-open border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.5)]" 
    : "border-slate-700";

  // Platform Logic
  const platformClass = state.platformActive
    ? "animate-float bottom-32 shadow-[0_0_30px_#a855f7] border-purple-400 bg-purple-900/50"
    : "bottom-0 border-slate-600 bg-slate-800";

  // Elevator Logic
  const getElevatorStyle = () => {
      if (state.elevatorLevel === 0) return { bottom: '0%' };
      if (state.elevatorLevel === 1) return { bottom: '40%', transition: 'bottom 2s ease-in-out' };
      if (state.elevatorLevel === 2) return { bottom: '80%', transition: 'bottom 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }; // Speed elevator
      return {};
  };
  const elevatorGlow = state.elevatorLevel === 2 ? "shadow-[0_0_40px_#3b82f6] border-blue-400 bg-blue-900/60" : "border-slate-600 bg-slate-800";

  // Common pause style
  const animationStyle = { animationPlayState: isPaused ? 'paused' : 'running' };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden border-l border-slate-800 shadow-inner">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 grid grid-cols-6 gap-4 opacity-10 pointer-events-none">
         {Array.from({length: 24}).map((_, i) => (
             <div key={i} className="border-r border-slate-700 h-full"></div>
         ))}
      </div>

      {/* Scene Container */}
      <div className="absolute bottom-0 w-full h-3/4 flex justify-around items-end px-10 pb-10 perspective-container">
        
        {/* 1. THE DOOR (Challenges 1, 3, 5) */}
        <div className={`relative w-32 h-48 ${currentChallengeId === 1 || currentChallengeId === 3 || currentChallengeId === 5 ? 'opacity-100' : 'opacity-30 blur-sm transition-opacity'}`}>
           <div className="absolute -top-8 left-0 w-full text-center text-xs text-slate-500 font-mono uppercase tracking-widest">WoodenDoor</div>
           <div 
               className={`w-full h-full bg-amber-900/20 border-2 rounded-t-lg origin-left transition-all duration-1000 relative overflow-hidden ${doorClass} door-hinge`}
               style={animationStyle}
           >
              {/* Door texture */}
              <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_19px,#0002_20px)]"></div>
              <div className="absolute top-1/2 right-4 w-3 h-3 rounded-full bg-yellow-600 shadow-sm"></div>
           </div>
           {/* Floor shadow */}
           <div className="absolute -bottom-4 left-0 w-full h-4 bg-black/50 blur-md rounded-full transform scale-x-110"></div>
        </div>

        {/* 2. THE PLATFORM (Challenges 2, 3, 5) */}
        <div className={`relative w-40 h-64 flex justify-center items-end ${currentChallengeId === 2 || currentChallengeId === 3 || currentChallengeId === 5 ? 'opacity-100' : 'opacity-30 blur-sm transition-opacity'}`}>
             <div className="absolute top-10 w-full text-center text-xs text-slate-500 font-mono uppercase tracking-widest z-10">MagicPlatform</div>
             <div 
                 className={`absolute w-32 h-8 border-2 rounded-lg backdrop-blur-sm flex items-center justify-center transition-all duration-1000 ${platformClass}`}
                 style={animationStyle}
             >
                 {state.platformActive && <Sparkles className="text-purple-300 animate-pulse" size={16} style={animationStyle} />}
             </div>
             {/* Energy Beam when active */}
             {state.platformActive && (
                 <div className="absolute bottom-0 w-16 h-32 bg-gradient-to-t from-purple-600/20 to-transparent blur-xl"></div>
             )}
        </div>

        {/* 3. THE ELEVATOR (Challenges 4, 5) */}
        <div className={`relative w-24 h-96 bg-slate-800/30 border-x border-slate-700 ${currentChallengeId === 4 || currentChallengeId === 5 ? 'opacity-100' : 'opacity-30 blur-sm transition-opacity'}`}>
             <div className="absolute -top-8 w-full text-center text-xs text-slate-500 font-mono uppercase tracking-widest">Elevator</div>
             {/* Shaft markings */}
             <div className="absolute inset-0 flex flex-col justify-between py-4 opacity-20">
                <div className="w-full h-1 bg-slate-500"></div>
                <div className="w-full h-1 bg-slate-500"></div>
                <div className="w-full h-1 bg-slate-500"></div>
                <div className="w-full h-1 bg-slate-500"></div>
             </div>
             
             {/* Car */}
             <div 
                style={getElevatorStyle()} 
                className={`absolute left-1 right-1 h-20 border-2 rounded flex items-center justify-center backdrop-blur-md transition-all ${elevatorGlow}`}
             >
                {state.elevatorLevel === 2 ? <Zap className="text-blue-400 animate-bounce" style={animationStyle} /> : <ArrowUpCircle className="text-slate-500" />}
             </div>
        </div>

      </div>

      {/* Global Effects */}
      {state.sparkles && (
          <div className="absolute inset-0 pointer-events-none">
              {Array.from({length: 20}).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute w-2 h-2 bg-white rounded-full animate-sparkle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random()}s`,
                        ...animationStyle
                    }}
                  ></div>
              ))}
          </div>
      )}

      {/* Info Overlay */}
      <div className="absolute top-4 right-4 bg-slate-900/80 border border-slate-700 p-3 rounded-lg backdrop-blur text-xs font-mono">
          <div className="flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${state.doorOpen ? 'bg-green-500' : 'bg-red-500'}`}></div> Door
          </div>
          <div className="flex items-center gap-2 mt-1">
             <div className={`w-2 h-2 rounded-full ${state.platformActive ? 'bg-green-500' : 'bg-red-500'}`}></div> Platform
          </div>
          <div className="flex items-center gap-2 mt-1">
             <div className={`w-2 h-2 rounded-full ${state.elevatorLevel > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div> Elevator
          </div>
      </div>
    </div>
  );
};