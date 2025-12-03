// src/components/Level_1_1_Simulation.jsx

import React from 'react';

// A reusable SVG component for the village houses
const House = ({ isLit, delay }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={`w-20 h-20 transition-all duration-1000 ${isLit ? 'opacity-100' : 'opacity-30'}`}
    style={{ transitionDelay: isLit ? delay : '0ms' }}
  >
    <path d="M50 10 L90 40 L90 90 L10 90 L10 40 Z" fill={isLit ? "#a16207" : "#3f3f46"} stroke={isLit ? "#facc15" : "#52525b"} strokeWidth="2" />
    <rect x="40" y="60" width="20" height="30" fill={isLit ? "#fef08a" : "#18181b"} />
  </svg>
);

export default function Level_1_1_Simulation({ isSuccess, isLoading, onContinue, levelData }) {
  // --- NEW DEFENSIVE CHECK ---
  // If the component is told to show the success state, but the levelData hasn't loaded yet,
  // we can't display the rewards. This check prevents the crash.
  const canShowSuccess = isSuccess && levelData && levelData.badge && levelData.xpReward;

  return (
    <div className="w-full h-full bg-gray-900/50 rounded-lg p-6 flex flex-col items-center justify-center border-2 border-gray-700 relative overflow-hidden">
      
      {/* The main Crystal */}
      <div className={`
        relative w-24 h-24 rounded-full border-4 flex items-center justify-center text-4xl
        transition-all duration-500 ease-in-out
        ${isSuccess ? 'bg-sky-400 border-sky-200 shadow-[0_0_30px_10px_#38bdf8]' : 'bg-gray-800 border-gray-600'}
        ${isLoading ? 'animate-pulse' : ''}
      `}>
        🔮
        {isSuccess && <div className="absolute inset-0 rounded-full bg-sky-300 opacity-50 animate-ping"></div>}
      </div>
      
      <h3 className="mt-4 text-2xl font-bold text-white text-shadow-md">The Communication Crystal</h3>
      
      {/* The village houses with staggered animation delays */}
      <div className="flex space-x-4 mt-8">
        <House isLit={isSuccess} delay="200ms" />
        <House isLit={isSuccess} delay="400ms" />
        <House isLit={isSuccess} delay="600ms" />
      </div>

      {/* --- RENDER SUCCESS MESSAGE ONLY IF SAFE --- */}
      {canShowSuccess && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center p-4 animate-fade-in" style={{ animationDelay: '1s' }}>
          
          <p className="text-4xl font-bold text-white mb-4">"Hello Mzansi!"</p>
          
          <div className="bg-green-600/50 border border-green-400 p-4 rounded-lg">
            <h2 className="text-3xl font-black text-green-300">Challenge Complete!</h2>
            <p className="text-lg text-white mt-2">
              You earned <span className="font-bold text-yellow-300">+{levelData.xpReward} XP</span> and the 
              <span className="font-bold text-yellow-300"> {levelData.badge.icon} {levelData.badge.name}</span> badge!
            </p>
          </div>

          <button 
            onClick={onContinue}
            className="mt-8 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xl px-10 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105 animate-pulse"
            style={{ animationDelay: '2s' }}
          >
            Continue to Next Level →
          </button>
        </div>
      )}
    </div>
  );
}