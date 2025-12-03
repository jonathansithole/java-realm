// src/components/InteractiveCreatureCustomizer.jsx

import React, { useState } from 'react';
import axios from 'axios';

// A visual component for the creature (no changes needed here)
const GeneratedCreature = ({ creature }) => (
  <div className="flex flex-col items-center creature-appear">
    <div 
      className="w-32 h-24 rounded-full flex items-center justify-center border-4 border-gray-800"
      style={{ backgroundColor: creature.color || 'gray' }}
    >
      <div className="text-4xl font-bold text-black">👁️</div>
    </div>
    <div className="flex justify-center mt-[-10px]">
      {Array.from({ length: parseInt(creature.legs) || 2 }).map((_, i) => (
        <div 
          key={i} 
          className="w-4 h-12 rounded-full mx-1 border-2 border-gray-800"
          style={{ backgroundColor: creature.color || 'gray' }}
        ></div>
      ))}
    </div>
  </div>
);

export default function InteractiveCreatureCustomizer({ userCode, onContinue }) {
  const [name, setName] = useState('Gloop');
  const [color, setColor] = useState('purple');
  const [legs, setLegs] = useState(6);
  const [description, setDescription] = useState('Click "Generate Description" to see your code in action!');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setDescription('...');

    // Find the non-public class name from the user's submitted code
    const classNameMatch = userCode.match(/class\s+(\w+)/);
    if (!classNameMatch) {
      setDescription("Error: Could not find the 'Creature' class in your code.");
      setIsLoading(false);
      return;
    }
    const className = classNameMatch[1];
    
    try {
      // Call our powerful new backend endpoint
      const response = await axios.post('http://localhost:5000/api/run-user-method', {
        userCode: userCode,
        className: className,
        constructorParams: [`"${name}"`, `"${color}"`, legs], // Pass constructor args
        methodName: 'getDescription',
        methodParams: [], // This method takes no parameters
      });
      setDescription(response.data.output || 'Error: No description returned.');
    } catch (error) {
      setDescription(error.response?.data?.error || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center animate-fade-in text-center">
      <div className="bg-purple-900/80 backdrop-blur-sm border-2 border-purple-500 rounded-2xl p-10 max-w-4xl shadow-2xl">
        <h1 className="text-4xl font-bold text-purple-300 mb-4">Success! You built a Creature Blueprint!</h1>
        <p className="text-xl text-white mb-6">Your `Creature` class is powering this UI. Customize a new creature and see your `getDescription()` method work in real-time.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls Panel */}
          <div className="bg-gray-900 p-6 rounded-lg space-y-4 text-left">
              <div>
                <label className="font-bold text-lg text-gray-300">Name:</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 mt-1 rounded bg-gray-700 text-white text-lg"/>
              </div>
              <div>
                <label className="font-bold text-lg text-gray-300">Color:</label>
                <input type="text" value={color} onChange={e => setColor(e.target.value)} className="w-full p-2 mt-1 rounded bg-gray-700 text-white text-lg"/>
              </div>
              <div>
                <label className="font-bold text-lg text-gray-300">Legs: {legs}</label>
                <input type="range" min="2" max="8" step="2" value={legs} onChange={e => setLegs(e.target.value)} className="w-full mt-1"/>
              </div>
              <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg text-xl font-bold transition-colors disabled:bg-gray-500">
                {isLoading ? 'Generating...' : 'Generate Description'}
              </button>
          </div>
          
          {/* Display Panel */}
          <div className="bg-purple-800/50 p-6 rounded-lg flex flex-col items-center justify-center">
            <GeneratedCreature creature={{name, color, legs}} />
            <p className="mt-4 text-xl font-semibold text-yellow-300 h-24">{description}</p>
          </div>
        </div>
        
        <button onClick={onContinue} className="mt-8 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xl px-10 py-3 rounded-lg">
          Journey to Inheritance Island →
        </button>
      </div>
    </div>
  );
}