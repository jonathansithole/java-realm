import React from 'react';
export default function Forge({ levelData, onContinue }) {
  if (!levelData) return null;
  return (
    <div className="w-full h-full flex items-center justify-center animate-fade-in text-center">
      <div className="bg-gray-800/80 backdrop-blur-sm border-2 border-orange-500 rounded-2xl p-10 max-w-3xl shadow-2xl">
        <h1 className="text-4xl font-bold text-orange-400 mb-6">The Ancient Forge</h1>
        <div className="relative w-64 h-40 mx-auto mb-6">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-16 bg-gray-600 rounded-t-lg border-b-4 border-gray-800"></div> {/* Anvil */}
          <div className="absolute bottom-16 right-0 w-24 h-24 hammer-swing"><div className="w-12 h-8 bg-gray-500 rounded ml-12"></div><div className="w-4 h-24 bg-yellow-800 rounded"></div></div>
          <p className="absolute bottom-20 left-1/2 -translate-x-1/2 text-5xl animate-ping" style={{animationDelay: '0.5s'}}>💥</p>
        </div>
        <p className="text-2xl text-white mt-6">You've automated the forge and crafted 3 swords!</p>
        <button onClick={onContinue} className="mt-8 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xl px-10 py-3 rounded-lg shadow-lg">Continue to the Fortress →</button>
      </div>
    </div>
  );
}