import React from 'react';

interface VisualizerProps {
  level: number;
  isCompleted: boolean; // If the current level is completed
}

const Visualizer: React.FC<VisualizerProps> = ({ level, isCompleted }) => {
  // Determine visible states based on level progress
  // Level 1 Complete: Telescope Appears
  // Level 2 Complete: Telescope Rotates & Platform 1 Rises
  // Level 3 Complete: Platform 2 Rises
  // Level 4 Complete: Lasers Fire
  // Level 5 Complete: Door Opens
  
  const showTelescope = (level > 1) || (level === 1 && isCompleted);
  const rotateTelescope = (level > 2) || (level === 2 && isCompleted);
  const showPlatform1 = (level > 2) || (level === 2 && isCompleted);
  const showPlatform2 = (level > 3) || (level === 3 && isCompleted);
  const fireLasers = (level > 4) || (level === 4 && isCompleted);
  const openDoor = (level === 5 && isCompleted);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-cyber-black to-indigo-950 overflow-hidden border-l border-cyan-900/50 rounded-r-xl">
      {/* Background Stars */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-10 left-20 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 left-80 w-1 h-1 bg-cyan-200 rounded-full animate-pulse"></div>
        <div className="absolute top-10 right-20 w-2 h-2 bg-purple-300 rounded-full animate-pulse blur-sm"></div>
        <div className="absolute bottom-40 left-1/4 w-1 h-1 bg-white rounded-full"></div>
      </div>

      {/* Main Scene Container */}
      <div className="absolute inset-0 flex items-center justify-center perspective-1000">
        
        {/* The Door (Back Layer) */}
        <div className={`absolute top-1/4 w-64 h-80 bg-slate-800 border-4 border-cyan-700 transition-all duration-[3000ms] ease-out ${openDoor ? 'opacity-0 scale-150' : 'opacity-100'}`}>
            {/* Door details */}
            <div className="absolute inset-0 flex">
                <div className={`w-1/2 h-full bg-slate-700 border-r border-black transition-transform duration-[3000ms] ${openDoor ? '-translate-x-full' : 'translate-x-0'}`}>
                   <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                </div>
                <div className={`w-1/2 h-full bg-slate-700 border-l border-black transition-transform duration-[3000ms] ${openDoor ? 'translate-x-full' : 'translate-x-0'}`}>
                    <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                </div>
            </div>
            {/* Door Glow behind */}
            {openDoor && <div className="absolute inset-0 bg-white blur-3xl animate-pulse z-[-1]"></div>}
        </div>

        {/* Platform 1 (Left) */}
        <div className={`absolute bottom-20 left-20 w-32 h-12 bg-slate-600 border-t-4 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-1000 transform ${showPlatform1 ? 'translate-y-0 opacity-100' : 'translate-y-40 opacity-20'}`}>
           <div className="text-[10px] text-cyan-300 text-center mt-2 font-mono">TELESCOPE BASE</div>
        </div>

        {/* Platform 2 (Right) */}
        <div className={`absolute bottom-40 right-20 w-32 h-12 bg-slate-600 border-t-4 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-1000 transform ${showPlatform2 ? 'translate-y-0 opacity-100' : 'translate-y-40 opacity-20'}`}>
            <div className="text-[10px] text-purple-300 text-center mt-2 font-mono">AUXILIARY</div>
        </div>

        {/* Laser Beams */}
        {fireLasers && (
             <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                 <line x1="15%" y1="80%" x2="50%" y2="40%" stroke="#00f3ff" strokeWidth="2" className="animate-pulse" />
                 <line x1="85%" y1="70%" x2="50%" y2="40%" stroke="#bc13fe" strokeWidth="2" className="animate-pulse" />
                 <circle cx="50%" cy="40%" r="10" fill="white" className="animate-ping" />
             </svg>
        )}

        {/* Telescope Object */}
        <div className={`absolute bottom-32 left-28 transition-all duration-1000 z-10 ${showTelescope ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
            <div className={`relative w-24 h-24 transition-transform duration-[5000ms] ${rotateTelescope ? 'rotate-45' : 'rotate-0'}`}>
                {/* Base */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-gray-400 rounded-full"></div>
                {/* Scope Body */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-20 bg-gradient-to-t from-gray-500 to-gray-300 rounded-t-lg origin-bottom transition-transform duration-[2000ms] hover:rotate-12"></div>
                {/* Lens */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-cyan-500/30 border border-cyan-200 shadow-[0_0_15px_cyan]"></div>
                
                {/* Beam (if scanning) */}
                {rotateTelescope && (
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-1 h-64 bg-gradient-to-t from-cyan-400/0 to-cyan-400/80 origin-bottom animate-[pulse_2s_infinite]"></div>
                )}
            </div>
        </div>
        
        {/* Second Telescope (Level 5) */}
         <div className={`absolute bottom-52 right-28 transition-all duration-1000 z-10 ${showPlatform2 && level >= 5 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
            <div className={`relative w-20 h-20 rotate-[-45deg]`}>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-400 rounded-full"></div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4 h-16 bg-gradient-to-t from-gray-500 to-purple-300 rounded-t-lg"></div>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-purple-500/30 border border-purple-200 shadow-[0_0_15px_purple]"></div>
                 {openDoor && (
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-1 h-64 bg-gradient-to-t from-purple-400/0 to-purple-400/80 origin-bottom animate-[pulse_2s_infinite]"></div>
                )}
            </div>
        </div>

      </div>

      {/* Status HUD */}
      <div className="absolute top-4 left-4 p-2 bg-black/50 border border-cyan-500/30 rounded backdrop-blur text-xs font-mono text-cyan-400">
        <div>SYSTEM STATUS: {isCompleted ? 'STABLE' : 'AWAITING INPUT'}</div>
        <div>MODULES ACTIVE: {level - 1}/5</div>
        {openDoor && <div className="text-neon-green mt-1 animate-pulse"> EXIT GRANTED</div>}
      </div>
    </div>
  );
};

export default Visualizer;
