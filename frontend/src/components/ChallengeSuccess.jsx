// src/components/ChallengeSuccess.jsx

import React from 'react';

// CORRECTED: Now accepts `onContinue` as a prop
export default function ChallengeSuccess({ levelData, onContinue }) {
  if (!levelData) return null;

  return (
    <div className="w-full h-full flex items-center justify-center animate-fade-in text-center">
      <div className="bg-green-800/80 p-10 rounded-2xl border-2 border-green-400">
        <h1 className="text-4xl font-bold text-green-300">🎉 Success! 🎉</h1>
        <p className="text-xl text-white mt-2">
          You earned <span className="font-bold text-yellow-300">+{levelData.xpReward} XP</span>!
        </p>
        {levelData.badge && (
          <p className="text-xl text-white mt-1">
            New Badge: <span className="font-bold text-yellow-300">{levelData.badge.icon} {levelData.badge.name}</span>
          </p>
        )}
        <button 
          onClick={onContinue} // CORRECTED: This now works
          className="mt-8 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}