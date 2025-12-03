import React from 'react';
export default function CharacterBattle({ levelData, onContinue }) {
  if (!levelData) return null;
  return (
    <div className="w-full h-full flex items-center justify-center animate-fade-in text-center">
      <div className="bg-red-900/80 p-10 rounded-2xl border-2 border-red-400">
        <div className="flex justify-center items-center space-x-8 text-8xl">
            <span>🤺</span><span className="text-4xl font-bold text-red-300">VS</span><span>🧙</span>
        </div>
        <h1 className="text-4xl font-bold text-red-300 mt-4">Victory!</h1>
        <p className="text-2xl text-white mt-2">Your party demonstrated perfect polymorphism!</p>
        <button onClick={onContinue} className="mt-8 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg">Continue →</button>
      </div>
    </div>
  );
}