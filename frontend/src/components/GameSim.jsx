export default function GameSim({ isSuccess }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 h-80 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Simulation</h2>
      <div className="text-8xl">
        <span className={isSuccess ? 'wave' : ''}>🇿🇦</span>
      </div>
      <p className="mt-4 text-lg">
        {isSuccess ? 'Great job! The nation says hello back!' : 'Waiting for correct code...'}
      </p>
    </div>
  );
}
