import React from 'react';
export default function PotionTable({ levelData, onContinue, output }) {
  if (!levelData) return null;
    const potionName = output.split(',')[0].split(':')[1] || 'Mystery Potion';
    return (
        <div className="w-full h-full flex items-center justify-center animate-fade-in text-center">
            <div className="bg-indigo-900/80 p-10 rounded-2xl border-2 border-indigo-400">
                <p className="text-8xl animate-bounce">🧪</p>
                <h1 className="text-4xl font-bold text-indigo-300 mt-4">Potion Brewed!</h1>
                <p className="text-2xl text-white mt-2">You created: <span className="font-bold text-yellow-300">{potionName}</span></p>
                <button onClick={onContinue} className="mt-8 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg">Continue →</button>
            </div>
        </div>
    );
}