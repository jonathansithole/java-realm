import React, { useMemo } from 'react';
const parseOutputData = (output) => {
  const data = {};
  if (!output) return data;
  output.split(',').forEach(pair => {
    const [key, value] = pair.split(':');
    if (key && value) data[key.trim()] = value.trim();
  });
  return data;
};
const GeneratedCreature = ({ creature }) => (
  <div className="flex flex-col items-center creature-appear">
    <div className="w-32 h-24 rounded-full flex items-center justify-center border-4 border-gray-800" style={{ backgroundColor: creature.color || 'gray' }}><div className="text-4xl font-bold text-black">👁️</div></div>
    <div className="flex justify-center mt-[-10px]">
      {Array.from({ length: parseInt(creature.legs) || 2 }).map((_, i) => (
        <div key={i} className="w-4 h-12 rounded-full mx-1 border-2 border-gray-800" style={{ backgroundColor: creature.color || 'gray' }}></div>
      ))}
    </div>
  </div>
);
export default function CreatureMenagerie({ onContinue, output }) {
  const creature = useMemo(() => parseOutputData(output), [output]);
  return (
    <div className="w-full h-full flex items-center justify-center animate-fade-in text-center">
      <div className="bg-purple-900/80 p-10 rounded-2xl border-2 border-purple-500">
        <h1 className="text-4xl font-bold text-purple-300 mb-6">Creature Menagerie</h1>
        <div className="bg-purple-800/50 p-6 rounded-lg mb-6">
          <GeneratedCreature creature={creature} />
          <p className="mt-4 text-3xl font-bold text-white">Behold, the mighty "{creature.name || 'Creature'}"!</p>
        </div>
        <p className="text-2xl text-white mt-6">You've brought a new creature to life with your code!</p>
        <button onClick={onContinue} className="mt-8 bg-sky-500 ...">Journey to Inheritance Island →</button>
      </div>
    </div>
  );
}