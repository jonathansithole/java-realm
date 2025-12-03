// src/components/GenericSuccess.jsx

import React from 'react';

// CORRECTED: Now accepts `onContinue` as a prop
export default function GenericSuccess({ levelData, onContinue }) {
  if (!levelData) return null;
  return (
    <div className="w-full h-full flex items-center justify-center animate-fade-in text-center">
      <div className="bg-gray-800/80 p-10 rounded-2xl border-2 border-green-400">
        <p className="text-8xl">✅</p>
        <h1 className="text-4xl font-bold text-green-300 mt-4">Success!</h1>
        <p className="text-xl text-white mt-2">You earned +{levelData.xpReward} XP!</p>
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