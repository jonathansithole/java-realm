
import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Timer, Info, Check, Pause, Play, XCircle, RefreshCw } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import CodeEditor from './components/CodeEditor.tsx';
import Visualizer from './components/Visualizer.tsx';
import { PUZZLES, MAX_TIME_SECONDS } from './constants.ts';
import { GameState } from './types.ts';

const App: React.FC = () => {
  // Game State
  const [gameState, setGameState] = useState<GameState>(GameState.INTRO);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME_SECONDS);
  const [reactorStats, setReactorStats] = useState([
    { name: 'Stability', value: 20 },
    { name: 'Sync', value: 15 },
    { name: 'Output', value: 30 },
  ]);

  // Editor State
  const [code, setCode] = useState("");
  const [editorError, setEditorError] = useState<string | null>(null);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentPuzzle = PUZZLES[currentPuzzleIndex];

  // Initialize Code when puzzle changes
  useEffect(() => {
    if (currentPuzzle) {
      setCode(currentPuzzle.brokenCode);
      setPuzzleSolved(false);
      setEditorError(null);
      setSuccessMessage(null);
    }
  }, [currentPuzzleIndex]);

  // Timer Logic
  useEffect(() => {
    if (gameState === GameState.PLAYING && !showTutorial && !isPaused) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState(GameState.GAME_OVER);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, showTutorial, isPaused]);

  const startGame = () => {
    setGameState(GameState.PLAYING);
    setShowTutorial(true);
    setIsPaused(false);
    setTimeLeft(MAX_TIME_SECONDS);
    setCurrentPuzzleIndex(0);
    setReactorStats([
      { name: 'Stability', value: 20 },
      { name: 'Sync', value: 15 },
      { name: 'Output', value: 30 },
    ]);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const resetGame = () => {
     setGameState(GameState.INTRO);
  };

  // Execute/Validate Code
  const handleExecute = useCallback(() => {
    if (puzzleSolved) return;

    // Client-side "compile" check using Regex for speed
    const isCorrect = currentPuzzle.solutionRegex.test(code);

    if (isCorrect) {
      setPuzzleSolved(true);
      setEditorError(null);
      setSuccessMessage("LOOP SYNCHRONIZED. SYSTEM STABILIZING...");
      
      // Update Stats
      setReactorStats(prev => prev.map(stat => ({
        ...stat,
        value: Math.min(100, stat.value + 25)
      })));

      // Advance Level after delay
      setTimeout(() => {
        if (currentPuzzleIndex < PUZZLES.length - 1) {
          setCurrentPuzzleIndex(prev => prev + 1);
        } else {
          setGameState(GameState.VICTORY);
        }
      }, 3000);

    } else {
      setEditorError("SYNTAX ERROR: Infinite loop or invalid logic detected.");
      
      // Penalize Stats slightly
      setReactorStats(prev => prev.map(stat => ({
        ...stat,
        value: Math.max(10, stat.value - 5)
      })));
    }
  }, [code, currentPuzzle, puzzleSolved, currentPuzzleIndex]);

  // INTRO SCREEN
  if (gameState === GameState.INTRO) {
    return (
      <div className="w-full h-screen bg-[#050505] flex flex-col items-center justify-center text-cyan-500 relative overflow-hidden font-['Orbitron']">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.1)_0%,_transparent_70%)]"></div>
        <h1 className="text-6xl font-black mb-2 tracking-tighter drop-shadow-[0_0_30px_rgba(6,182,212,0.6)] text-center z-10">
          THE LOOP<br />REACTOR CORE
        </h1>
        <p className="text-xl mb-12 text-cyan-200/70 font-mono z-10 tracking-widest">LEVEL 3: PULSATING TECHNO-MAZE</p>
        
        <button 
          onClick={startGame}
          className="px-12 py-4 bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xl rounded-sm shadow-[0_0_30px_cyan] transition-all hover:scale-105 hover:tracking-widest z-10 uppercase"
        >
          Initialize Interface
        </button>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-cyan-900/20 to-transparent"></div>
      </div>
    );
  }

  // GAME OVER SCREEN
  if (gameState === GameState.GAME_OVER) {
    return (
      <div className="w-full h-screen bg-red-950 flex flex-col items-center justify-center text-red-500 font-['Orbitron']">
        <h1 className="text-7xl font-black mb-4 animate-pulse">CRITICAL FAILURE</h1>
        <p className="text-2xl mb-8 font-mono">REACTOR MELTDOWN COMPLETE</p>
        <button 
          onClick={startGame}
          className="px-8 py-3 border-2 border-red-500 hover:bg-red-500 hover:text-black font-bold rounded transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          REBOOT SYSTEM
        </button>
      </div>
    );
  }

  // VICTORY SCREEN
  if (gameState === GameState.VICTORY) {
    return (
      <div className="w-full h-screen bg-cyan-950 flex flex-col items-center justify-center text-cyan-400 font-['Orbitron']">
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-cyan-400 blur-3xl opacity-20"></div>
          <h1 className="text-6xl font-black mb-4 animate-bounce relative z-10 text-white">LEVEL 3 COMPLETE</h1>
        </div>
        <p className="text-xl mb-8 font-mono tracking-widest text-cyan-200">REACTOR SYNCHRONIZED</p>
        <div className="p-6 bg-black/40 rounded border border-cyan-500/30 backdrop-blur-sm">
           <div className="text-center">
             <div className="text-5xl font-bold text-white mb-2">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
             <div className="text-sm text-cyan-500 tracking-widest uppercase">Time Remaining</div>
           </div>
        </div>
        <button 
          onClick={startGame}
          className="mt-12 px-8 py-3 bg-cyan-600 text-black font-bold rounded hover:bg-cyan-500 transition-colors"
        >
          REPLAY LEVEL
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-[#050505] text-gray-200 overflow-hidden font-['Orbitron'] relative">
      
      {/* TUTORIAL OVERLAY */}
      {showTutorial && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-500">
          <div className="bg-gray-900 border border-cyan-500/50 max-w-3xl w-full rounded-lg shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden">
            <div className="bg-cyan-900/30 p-6 border-b border-cyan-500/30">
              <h2 className="text-2xl text-cyan-400 font-bold flex items-center gap-3">
                <Info className="w-6 h-6" /> 
                MISSION BRIEFING: THE LOOP REACTOR
              </h2>
            </div>
            <div className="p-8 space-y-6 text-gray-300 font-sans leading-relaxed">
              <div>
                <h3 className="text-cyan-400 font-bold mb-2 uppercase tracking-wider">Objective</h3>
                <p>The Reactor Core loops are desynchronized. Write and fix code loops to realign the reactor before the countdown hits zero.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/30 p-4 rounded border-t-2 border-cyan-500">
                  <h4 className="font-bold text-cyan-400 mb-1">1. Write Loops</h4>
                  <p className="text-sm">Correct loops move the explorer, open doors, and extend bridges.</p>
                </div>
                <div className="bg-black/30 p-4 rounded border-t-2 border-red-500">
                  <h4 className="font-bold text-red-400 mb-1">2. Avoid Infinite Loops</h4>
                  <p className="text-sm">Infinite loops freeze the maze and waste time.</p>
                </div>
                <div className="bg-black/30 p-4 rounded border-t-2 border-green-500">
                  <h4 className="font-bold text-green-400 mb-1">3. Stabilize</h4>
                  <p className="text-sm">Complete all 5 puzzles to synchronize the core.</p>
                </div>
              </div>

              <div className="bg-cyan-950/30 p-4 rounded text-sm text-cyan-200 border border-cyan-900/50 flex gap-4 items-center">
                <Activity className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                   <strong>Loop Types:</strong> You will use <em>for-loops</em> (movement), <em>while-loops</em> (checks), and <em>nested loops</em> (patterns).
                </div>
              </div>
            </div>
            <div className="p-6 bg-black/50 border-t border-cyan-900/30 flex justify-end">
              <button 
                onClick={() => setShowTutorial(false)}
                className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded transition-colors shadow-lg shadow-cyan-900/50 uppercase tracking-wider"
              >
                Start Mission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAUSE OVERLAY */}
      {isPaused && !showTutorial && (
         <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center animate-pulse">
               <Pause className="w-16 h-16 text-cyan-500 mb-4" />
               <h2 className="text-4xl font-bold text-cyan-400 tracking-widest">SYSTEM PAUSED</h2>
               <button 
                 onClick={togglePause}
                 className="mt-8 px-8 py-2 border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors uppercase"
               >
                 Resume
               </button>
            </div>
         </div>
      )}

      {/* HUD Header */}
      <header className="h-16 border-b border-cyan-900/30 bg-[#080808] flex items-center justify-between px-6 z-10 shrink-0 shadow-lg">
        <div className="flex items-center gap-4">
          <Activity className="text-cyan-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-widest text-cyan-100 leading-none">LEVEL 3</span>
            <span className="text-xs text-cyan-700 tracking-[0.2em]">THE LOOP REACTOR</span>
          </div>
        </div>
        
        {/* Puzzle Progress */}
        <div className="flex gap-2 items-center">
           {PUZZLES.map((p, i) => (
             <div 
               key={p.id} 
               className={`h-2 w-10 rounded-full transition-all duration-500 ${
                 i < currentPuzzleIndex ? 'bg-cyan-500 shadow-[0_0_8px_cyan]' : 
                 i === currentPuzzleIndex ? 'bg-white animate-pulse' : 'bg-gray-800'
               }`} 
             />
           ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-3 font-mono text-xl px-4 py-1 rounded bg-black/50 border border-cyan-900/30 ${timeLeft < 60 ? 'text-red-500 border-red-900/50 animate-pulse' : 'text-cyan-400'}`}>
            <Timer className="w-5 h-5" />
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>

          <div className="h-8 w-px bg-gray-800 mx-2"></div>

          <button 
            onClick={togglePause}
            className="p-2 text-cyan-500 hover:text-cyan-300 hover:bg-cyan-900/30 rounded transition-colors"
            title={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
          </button>

          <button 
            onClick={resetGame}
            className="p-2 text-red-500 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors"
            title="Abort Level"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0">
        
        {/* Left: Code Interface */}
        <div className="h-full overflow-hidden border-r border-cyan-900/30 bg-[#080808] flex flex-col">
          <CodeEditor 
            code={code}
            onChange={setCode}
            onExecute={handleExecute}
            error={editorError}
            title={currentPuzzle.title}
            description={currentPuzzle.description}
            isSolved={puzzleSolved}
            hint={currentPuzzle.hint}
          />
        </div>

        {/* Right: Visuals & Stats */}
        <div className="h-full bg-black relative flex flex-col overflow-hidden">
          
          {/* Success Overlay on Right Side */}
          {successMessage && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-green-900/90 text-green-100 px-6 py-3 rounded border border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)] flex items-center gap-3 animate-in slide-in-from-top-4 fade-in duration-300">
              <Check className="w-5 h-5" />
              <span className="font-bold tracking-wider">{successMessage}</span>
            </div>
          )}

          {/* Game Viewport */}
          <div className="flex-1 relative border-b border-cyan-900/30 min-h-0 bg-[radial-gradient(circle_at_center,_#0c0c0c_0%,_#000_100%)]">
             <Visualizer 
                puzzle={currentPuzzle} 
                isSolved={puzzleSolved} 
                isSolving={false}
             />
          </div>

          {/* Bottom Stats Panel */}
          <div className="h-48 bg-[#050505] p-4 shrink-0 flex gap-4 border-t border-cyan-900/30">
             
             {/* Reactor Status Text */}
             <div className="flex-1 bg-cyan-950/10 border border-cyan-900/30 p-4 rounded flex flex-col justify-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/50"></div>
               <h3 className="text-cyan-600 text-xs font-bold tracking-widest mb-2">SYSTEM DIAGNOSTIC</h3>
               <div className="text-2xl font-mono text-cyan-400">
                 {puzzleSolved ? "OPTIMAL" : "UNSTABLE"}
               </div>
               <div className="text-gray-500 text-xs mt-1">
                 Fix the logic to prevent critical failure.
               </div>
             </div>

             {/* Chart */}
             <div className="w-64 bg-cyan-950/10 border border-cyan-900/30 p-3 rounded flex flex-col">
               <h3 className="text-xs text-cyan-600 font-bold tracking-widest mb-2 uppercase">Core Stability</h3>
               <div className="flex-1 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reactorStats}>
                      <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                        {reactorStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.value < 40 ? '#ef4444' : '#0891b2'} />
                        ))}
                      </Bar>
                    </BarChart>
                 </ResponsiveContainer>
               </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
