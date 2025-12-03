import React from 'react';
export default function CrystalAwakening({ levelData, onContinue }) {
  if (!levelData || !levelData.badge) return null;
  return (
    <div className="w-full h-full flex items-center justify-center animate-fade-in text-center">
      <div className="bg-sky-900/80 p-10 rounded-2xl border-2 border-sky-400">
        <p className="text-8xl animate-pulse">🔮</p>
        <h1 className="text-4xl font-bold text-sky-300 mt-4">Crystal Awakened!</h1>
        <p className="text-xl text-white mt-2">You earned +{levelData.xpReward} XP and the {levelData.badge.icon} {levelData.badge.name} badge!</p>
        <button onClick={onContinue} className="mt-8 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg">Continue →</button>
      </div>
    </div>
  );
}