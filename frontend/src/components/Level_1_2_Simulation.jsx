// src/components/Level_1_2_Simulation.jsx

import React from 'react';

// Reusable SVG for a villager icon
const Villager = ({ isHappy }) => (
    <div className="relative">
        <svg viewBox="0 0 100 100" className="w-24 h-24">
            <circle cx="50" cy="30" r="20" fill="#fde047" /> {/* Head */}
            <path d="M20 90 Q50 60 80 90 Z" fill="#3b82f6" /> {/* Body */}
            {/* Mouth */}
            <path d={isHappy ? "M40 35 Q50 45 60 35" : "M40 40 Q50 30 60 40"} stroke="black" strokeWidth="2" fill="none" />
        </svg>
        {/* Thought Bubble */}
        <div className={`absolute -top-8 -right-8 bg-white text-black p-2 rounded-full text-3xl transition-opacity duration-500 ${isHappy ? 'opacity-0' : 'opacity-100'}`}>
            🤔
        </div>
    </div>
);

export default function Level_1_2_Simulation({ levelData }) {
    if (!levelData) return null;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="flex items-center space-x-8">
                {/* The Villager */}
                <Villager isHappy={true} />

                {/* The Message */}
                <div className="bg-yellow-800/80 p-4 rounded-lg border-2 border-yellow-600">
                    <p className="text-2xl font-bold text-green-300">// This code is so clear!</p>
                    <pre className="text-left text-lg text-white mt-2"><code>
                        {`// Stores the villager count\nint villagerCount = 42;`}
                    </code></pre>
                </div>
            </div>

            <div className="mt-8 bg-green-600/50 border border-green-400 p-6 rounded-lg">
                <h1 className="text-4xl font-black text-green-300">🎉 Clarity Achieved! 🎉</h1>
                <p className="text-xl text-white mt-2">
                    Now everyone understands the code. Great work!
                </p>
                {/* Rewards */}
                <div className="flex justify-center items-center space-x-6 mt-6">
                    <div className="bg-gray-900 p-3 rounded-lg">
                        <p className="text-3xl font-bold text-yellow-400">+{levelData.xpReward} XP</p>
                    </div>
                    {levelData.badge && (
                        <div className="bg-gray-900 p-3 rounded-lg text-center">
                            <p className="text-4xl">{levelData.badge.icon}</p>
                            <p className="font-bold text-yellow-400 mt-1">Badge: {levelData.badge.name}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}