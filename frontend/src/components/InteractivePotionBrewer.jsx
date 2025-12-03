// src/components/InteractivePotionBrewer.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function InteractivePotionBrewer({ userCode, onContinue }) {
  const [ingredient1, setIngredient1] = useState('Stardust');
  const [ingredient2, setIngredient2] = useState('River Water');
  const [result, setResult] = useState('...');
  const [isLoading, setIsLoading] = useState(false);

  const handleBrew = async () => {
    setIsLoading(true);
    const classNameMatch = userCode.match(/class\s+(\w+)/);
    if (!classNameMatch) { setResult("Error"); setIsLoading(false); return; }
    const className = classNameMatch[1];
    
    try {
      const response = await axios.post('http://localhost:5000/api/run-user-method', {
        userCode, className, methodName: 'mix',
        params: [`"${ingredient1}"`, `"${ingredient2}"`], // Strings need to be in quotes
      });
      setResult(response.data.output || 'Error');
    } catch {
      setResult('Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center animate-fade-in text-center">
      <div className="bg-indigo-900/80 p-10 rounded-2xl border-2 border-indigo-400">
        <h1 className="text-4xl font-bold text-indigo-300 mb-4">You are an Alchemist!</h1>
        <p className="text-xl text-white mb-6">Test your `mix` method with different ingredients.</p>
        
        <div className="bg-gray-900 p-6 rounded-lg flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <select value={ingredient1} onChange={e => setIngredient1(e.target.value)} className="p-2 rounded bg-gray-700 text-white">
              <option>Stardust</option><option>Ginseng</option><option>Toadstool</option>
            </select>
            <span className="text-2xl">+</span>
            <select value={ingredient2} onChange={e => setIngredient2(e.target.value)} className="p-2 rounded bg-gray-700 text-white">
              <option>River Water</option><option>Moonpetal</option><option>Dragon Scale</option>
            </select>
          </div>
          <button onClick={handleBrew} disabled={isLoading} className="bg-indigo-500 px-6 py-3 rounded text-xl">Brew Potion 🧪</button>
          <div className="mt-4 text-center">
            <p className="text-lg text-gray-400">Result:</p>
            <p className="text-2xl font-bold text-yellow-300">{isLoading ? 'Brewing...' : result}</p>
          </div>
        </div>

        <button onClick={onContinue} className="mt-8 bg-sky-500 ...">Continue to the Oasis →</button>
      </div>
    </div>
  );
}