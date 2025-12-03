import React from 'react';
export default function LogicMaze({ levelData, onContinue, output }) {
  if (!levelData) return null;
    const path = output.split(':')[1] || 'the Correct Path';
    return (
        <div className="w-full h-full flex items-center justify-center animate-fade-in text-center">
            <div className="bg-green-900/80 p-10 rounded-2xl border-2 border-green-400">
                <p className="text-6xl">🌲🧭🌲</p>
                <h1 className="text-4xl font-bold text-green-300 mt-4">You Chose Wisely!</h1>
                <p className="text-2xl text-white mt-2">You followed <span className="font-bold text-yellow-300">{path}</span> and escaped the maze.</p>
                <button onClick={onContinue} className="mt-8 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg">Continue →</button>
            </div>
        </div>
    );
}