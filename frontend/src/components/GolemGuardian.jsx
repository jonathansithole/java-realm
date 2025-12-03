import React from 'react';
export default function GolemGuardian({ levelData, onContinue }) {
  if (!levelData) return null;
    return (
        <div className="w-full h-full flex items-center justify-center animate-fade-in text-center">
            <div className="bg-gray-700/80 p-10 rounded-2xl border-2 border-green-400">
                <p className="text-8xl animate-pulse">🗿</p>
                <h1 className="text-4xl font-bold text-green-300 mt-4">The Golem Awakens!</h1>
                <p className="text-xl text-white mt-2">The path is open. You have proven your logic.</p>
                <button onClick={onContinue} className="mt-8 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg">Continue →</button>
            </div>
        </div>
    );
}