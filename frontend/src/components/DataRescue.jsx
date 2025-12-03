import React from 'react';
export default function DataRescue({ levelData, onContinue }) {
  if (!levelData) return null;
  return (
    <div className="w-full h-full flex items-center justify-center animate-fade-in text-center">
      <div className="bg-cyan-900/80 p-10 rounded-2xl border-2 border-cyan-400">
        <p className="text-8xl">💾</p>
        <h1 className="text-4xl font-bold text-cyan-300 mt-4">Data Rescued!</h1>
        <p className="text-2xl text-white mt-2">Your `try-catch` block prevented a system crash!</p>
        <button onClick={onContinue} className="mt-8 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg">Continue →</button>
      </div>
    </div>
  );
}