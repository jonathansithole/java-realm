import React from 'react';
export default function FinalProject({ levelData, onContinue }) {
  if (!levelData || !levelData.badge) return null;
  return (
    <div className="w-full h-full flex items-center justify-center animate-fade-in text-center">
      <div className="bg-yellow-800/80 p-10 rounded-2xl border-2 border-yellow-300">
        <p className="text-8xl">{levelData.badge.icon}</p>
        <h1 className="text-5xl font-black text-yellow-300 mt-4">Congratulations, Java Sage!</h1>
        <p className="text-2xl text-white mt-4">You have completed all core challenges and proven your mastery.</p>
        <button onClick={onContinue} className="mt-8 bg-green-500 hover:bg-green-600 text-white font-bold text-xl px-10 py-3 rounded-lg">Return to World Map</button>
      </div>
    </div>
  );
}