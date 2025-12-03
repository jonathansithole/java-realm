import React from 'react';
export default function VillageStore({ levelData, onContinue }) {
  if (!levelData) return null;
  return (
    <div className="w-full h-full flex items-center justify-center animate-fade-in text-center">
      <div className="bg-yellow-900/80 backdrop-blur-sm border-4 border-yellow-700 rounded-2xl p-10 max-w-3xl shadow-2xl">
        <h1 className="text-4xl font-bold text-yellow-200 mb-6">Village Store Counter</h1>
        <div className="bg-yellow-800 p-6 rounded-lg text-left text-2xl font-mono text-white space-y-2">
          <p>🍎 Apples x 3  ....... 15 coins</p>
          <p>🍞 Bread x 1   ....... 10 coins</p>
          <hr className="border-dashed border-yellow-400 my-2" />
          <p className="font-bold text-yellow-300">TOTAL: {levelData.solution} coins</p>
        </div>
        <p className="text-2xl text-white mt-6 animate-pulse">Thank you for your help!</p>
        <button onClick={onContinue} className="mt-8 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xl px-10 py-3 rounded-lg shadow-lg">Continue Your Journey →</button>
      </div>
    </div>
  );
}