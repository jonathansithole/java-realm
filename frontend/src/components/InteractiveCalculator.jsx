// src/components/InteractiveCalculator.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function InteractiveCalculator({ userCode, onContinue }) {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [result, setResult] = useState('?');
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/run-user-method', {
        userCode: userCode,
        methodName: 'add',
        params: [parseInt(num1) || 0, parseInt(num2) || 0],
      });
      setResult(response.data.output || 'Error');
    } catch (error) {
      setResult('Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center animate-fade-in text-center">
      <div className="bg-gray-800/80 p-10 rounded-2xl border-2 border-green-400">
        <h1 className="text-4xl font-bold text-green-300 mb-4">Success! You built a Calculator!</h1>
        <p className="text-xl text-white mb-6">Now, test the `add` method you just wrote.</p>
        
        <div className="bg-gray-900 p-6 rounded-lg flex items-center justify-center space-x-4">
          <input type="number" value={num1} onChange={e => setNum1(e.target.value)} className="w-24 text-center text-3xl p-2 rounded bg-gray-700 text-white" />
          <span className="text-3xl font-bold">+</span>
          <input type="number" value={num2} onChange={e => setNum2(e.target.value)} className="w-24 text-center text-3xl p-2 rounded bg-gray-700 text-white" />
          <button onClick={handleCalculate} disabled={isLoading} className="bg-green-500 px-4 py-3 rounded text-2xl">=</button>
          <span className="text-3xl font-bold w-24">{isLoading ? '...' : result}</span>
        </div>

        <button onClick={onContinue} className="mt-8 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg">Continue to the Forest →</button>
      </div>
    </div>
  );
}