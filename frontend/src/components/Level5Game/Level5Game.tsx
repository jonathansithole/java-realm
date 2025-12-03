import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Terminal, CheckCircle, Cpu, ChevronRight, BookOpen, Zap, X, Clock, AlertTriangle, LogOut } from 'lucide-react';
import { CHALLENGES } from './constants.ts';
import { verifyCodeWithGemini, getHintFromGemini } from './services/geminiService.ts';
import Visualizer from './components/Visualizer.tsx';
import { GameState, VerificationResult } from './types.ts';

const INITIAL_TIME = 600; // 10 minutes

const App: React.FC = () => {
  // --- State Management ---
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 1,
    completedLevels: [],
    isVerifying: false,
    code: CHALLENGES[0].initialCode,
    logs: ["System initialization...", "MEK-5: Ready for input."],
    feedback: null,
    showSuccessModal: false,
    timeLeft: INITIAL_TIME,
    isPaused: false,
    isGameOver: false,
    isGameClosed: false
  });

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Scroll console to bottom on log update
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [gameState.logs]);

  // Timer Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (!gameState.isPaused && !gameState.isGameOver && !gameState.showSuccessModal && !gameState.isGameClosed) {
      interval = setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
             return { ...prev, timeLeft: 0, isGameOver: true };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameState.isPaused, gameState.isGameOver, gameState.showSuccessModal, gameState.isGameClosed]);

  // Update code when level changes
  useEffect(() => {
    const currentChallenge = CHALLENGES.find(c => c.id === gameState.currentLevel);
    if (currentChallenge) {
      setGameState(prev => ({
        ...prev,
        code: currentChallenge.initialCode,
        logs: [`--- Level ${gameState.currentLevel} Loaded ---`, "MEK-5: " + currentChallenge.instructions],
        feedback: null,
        showSuccessModal: false,
        isPaused: false
      }));
    }
  }, [gameState.currentLevel]);

  // --- Handlers ---

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!gameState.isPaused && !gameState.isGameOver && !gameState.isGameClosed) {
      setGameState(prev => ({ ...prev, code: e.target.value }));
    }
  };

  const handleRunCode = async () => {
    const currentChallenge = CHALLENGES.find(c => c.id === gameState.currentLevel);
    if (!currentChallenge) return;

    setGameState(prev => ({ 
      ...prev, 
      isVerifying: true, 
      logs: [...prev.logs, "> Compiling...", "> Verifying logic..."] 
    }));

    const result: VerificationResult = await verifyCodeWithGemini(
      gameState.code,
      currentChallenge.description,
      currentChallenge.instructions
    );

    setGameState(prev => {
      const newLogs = [...prev.logs];
      if (result.consoleOutput) {
        newLogs.push(`Output: ${result.consoleOutput}`);
      }
      
      return {
        ...prev,
        isVerifying: false,
        feedback: result.feedback,
        logs: newLogs,
        showSuccessModal: result.passed,
        completedLevels: result.passed 
          ? [...new Set([...prev.completedLevels, prev.currentLevel])] 
          : prev.completedLevels
      };
    });
  };

  const handleGetHint = async () => {
    const currentChallenge = CHALLENGES.find(c => c.id === gameState.currentLevel);
    if (!currentChallenge) return;

    setGameState(prev => ({...prev, isVerifying: true}));
    const hint = await getHintFromGemini(gameState.code, currentChallenge.instructions);
    
    setGameState(prev => ({
      ...prev,
      isVerifying: false,
      logs: [...prev.logs, `MEK-5 (Hint): ${hint}`]
    }));
  };

  const handleNextLevel = () => {
    if (gameState.currentLevel < CHALLENGES.length) {
      setGameState(prev => ({ ...prev, currentLevel: prev.currentLevel + 1 }));
    }
  };

  const handleResetCode = () => {
    const currentChallenge = CHALLENGES.find(c => c.id === gameState.currentLevel);
    if (currentChallenge) {
      setGameState(prev => ({ 
        ...prev, 
        code: currentChallenge.initialCode,
        logs: [...prev.logs, "Code reset to template."] 
      }));
    }
  };

  const handleCloseGame = () => {
    if (window.confirm("Are you sure you want to exit the mission? Progress will be lost.")) {
      // 1. Notify parent container (if iframe/embedded)
      try {
        window.parent.postMessage({ type: "close" }, "*");
      } catch (e) {
        console.debug("Failed to post message to parent", e);
      }

      // 2. Attempt standard window close
      try {
        window.close();
      } catch (e) {
        console.debug("Failed to close window", e);
      }

      // 3. Try navigating back (opens parent container/page)
      try {
         if (window.history.length > 1) {
            window.history.back();
         }
      } catch(e) {
         console.debug("Failed to navigate back", e);
      }

      // 4. Update state to unmount UI (fallback if above fails or for clean transition)
      setGameState(prev => ({ ...prev, isGameClosed: true }));
    }
  };

  const togglePause = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentChallenge = CHALLENGES.find(c => c.id === gameState.currentLevel) || CHALLENGES[0];
  const isLevelComplete = gameState.completedLevels.includes(gameState.currentLevel);

  if (gameState.isGameClosed) {
    return null;
  }

  return (
    <div className="h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-100 flex flex-col lg:overflow-hidden overflow-y-auto">
      
      {/* Header */}
      <header className="h-14 border-b border-cyan-900/50 bg-slate-900/90 backdrop-blur flex items-center px-4 justify-between shrink-0 sticky top-0 z-50 lg:relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/30 hidden sm:flex">
            <Cpu className="w-5 h-5 text-neon-blue" />
          </div>
          <div>
            <h1 className="text-sm md:text-lg font-bold text-white tracking-wide">OBJECT OBSERVATORY</h1>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-4">
           <div className={`flex items-center gap-2 font-mono text-lg font-bold ${gameState.timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
              <Clock className="w-4 h-4" />
              {formatTime(gameState.timeLeft)}
           </div>

           <button 
             onClick={togglePause}
             className="p-2 rounded-full hover:bg-slate-800 transition-colors text-white"
             title={gameState.isPaused ? "Resume" : "Pause"}
           >
             {gameState.isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
           </button>

           <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>

           <div className="text-xs font-mono text-slate-500 hidden sm:block">
             LVL {gameState.currentLevel}/{CHALLENGES.length}
           </div>

           <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>

           <button 
             onClick={handleCloseGame}
             className="p-2 rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-500 transition-colors"
             title="Close Game"
           >
             <X className="w-5 h-5" />
           </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden relative">
        
        {/* Pause Overlay */}
        {gameState.isPaused && (
          <div className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
             <h2 className="text-4xl font-bold text-white mb-4 tracking-widest">PAUSED</h2>
             <button 
               onClick={togglePause}
               className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold flex items-center gap-2 transition-all"
             >
               <Play className="w-5 h-5 fill-current" /> RESUME MISSION
             </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState.isGameOver && (
           <div className="fixed inset-0 z-[70] bg-red-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
             <AlertTriangle className="w-20 h-20 text-red-500 mb-6 animate-bounce" />
             <h2 className="text-4xl font-bold text-white mb-2">MISSION CRITICAL FAILURE</h2>
             <p className="text-red-200 mb-8 max-w-md">The Observatory power reserves have been depleted. Objects failed to initialize in time.</p>
             <button 
               onClick={() => window.location.reload()}
               className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)]"
             >
               REBOOT SYSTEM
             </button>
           </div>
        )}

        {/* Left Panel: Editor & Instructions */}
        <div className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-cyan-900/50 min-h-[600px] lg:h-auto lg:min-h-0">
          
          {/* Instructions Area */}
          <div className="p-4 bg-slate-900 border-b border-cyan-900/30 max-h-[30%] overflow-y-auto shrink-0">
            <div className="flex items-center gap-2 mb-2 text-neon-blue font-mono text-xs uppercase tracking-wider">
              <BookOpen className="w-3 h-3" />
              <span>Mission: {currentChallenge.title}</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              {currentChallenge.description}
            </p>
            <div className="p-2.5 bg-cyan-950/30 border border-cyan-500/20 rounded flex gap-2">
              <div className="text-cyan-400 font-bold">›</div>
              <p className="text-xs text-cyan-100 font-mono">{currentChallenge.instructions}</p>
            </div>
          </div>

          {/* Editor Toolbar */}
          <div className="flex items-center justify-between bg-slate-900 px-4 py-2 border-b border-slate-800 shrink-0">
            <span className="text-xs font-mono text-slate-500 flex items-center gap-2">
              <Terminal className="w-3 h-3" /> Editor.java
            </span>
            <div className="flex items-center gap-1">
               <button 
                  onClick={handleGetHint}
                  disabled={gameState.isVerifying || gameState.isGameOver || gameState.isGameClosed}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-yellow-500 hover:text-yellow-300 hover:bg-yellow-500/10 rounded transition-colors mr-2"
                  title="Get Hint from MEK-5"
                >
                  <Zap className="w-3 h-3" /> HINT
                </button>
                <div className="h-4 w-px bg-slate-700 mx-1"></div>
               <button 
                  onClick={handleResetCode}
                  className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
                  title="Reset to Template"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">RESET</span>
                </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 relative flex flex-col min-h-0 bg-slate-950">
            <textarea 
              value={gameState.code}
              onChange={handleCodeChange}
              spellCheck={false}
              disabled={gameState.isGameOver || gameState.isGameClosed}
              className="flex-1 bg-transparent text-sm font-mono p-4 resize-none focus:outline-none text-cyan-50 leading-relaxed w-full h-full"
              style={{ fontFamily: '"Fira Code", monospace' }}
            />
          </div>

           {/* Console Output */}
           <div className="h-32 bg-black border-t border-cyan-900/50 flex flex-col font-mono text-xs p-3 overflow-hidden shrink-0">
             <div className="flex-1 overflow-y-auto space-y-1">
               {gameState.logs.map((log, i) => (
                 <div key={i} className={`${log.includes('ERROR') || log.includes('Bzzzt') ? 'text-red-400' : 'text-green-400/80'}`}>
                   <span className="opacity-50 mr-2">$</span>{log}
                 </div>
               ))}
               <div ref={consoleEndRef} />
             </div>
          </div>

          {/* Run Button Area */}
          <div className="p-3 bg-slate-900 border-t border-slate-800">
              <button 
                onClick={handleRunCode}
                disabled={gameState.isVerifying || gameState.isGameOver || gameState.isGameClosed}
                className={`
                  w-full flex items-center justify-center gap-2 py-2.5 rounded-md font-bold text-sm transition-all
                  ${gameState.isVerifying 
                    ? 'bg-slate-700 text-slate-400 cursor-wait' 
                    : 'bg-neon-blue/10 text-neon-blue border border-neon-blue/50 hover:bg-neon-blue hover:text-black shadow-[0_0_10px_rgba(0,243,255,0.2)]'
                  }
                `}
              >
                {gameState.isVerifying ? (
                  <>
                    <span className="animate-spin">⟳</span> PROCESSING...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" /> RUN PROGRAM
                  </>
                )}
              </button>
          </div>
        </div>

        {/* Right Panel: Visualizer & Feedback */}
        <div className="w-full lg:w-1/2 flex flex-col bg-slate-900 relative min-h-[400px] lg:h-auto lg:min-h-0 lg:overflow-hidden">
          <div className="flex-1 relative">
             <Visualizer level={gameState.currentLevel} isCompleted={isLevelComplete} />
          </div>
          
          {/* MEK-5 Dialogue Overlay */}
          {gameState.feedback && !gameState.showSuccessModal && (
             <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 border border-purple-500/50 p-3 rounded-lg shadow-xl flex gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 z-20">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-purple-500">
                   <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-blink"></div>
                      <div className="w-1.5 h-1.5 bg-white rounded-full ml-0.5 animate-blink animation-delay-200"></div>
                   </div>
                </div>
                <div className="flex-1 min-w-0">
                   <div className="text-purple-400 font-bold text-[10px] mb-0.5 uppercase">MEK-5 Analysis</div>
                   <p className="text-xs text-white leading-snug">{gameState.feedback}</p>
                </div>
             </div>
          )}
        </div>

      </main>

      {/* Success Modal */}
      {gameState.showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="bg-slate-900 border border-neon-green/50 rounded-2xl max-w-md w-full p-6 shadow-[0_0_50px_rgba(10,255,104,0.2)] relative overflow-hidden">
              <div className="relative z-10 text-center">
                 <div className="w-12 h-12 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-neon-green animate-bounce">
                    <CheckCircle className="w-6 h-6 text-neon-green" />
                 </div>
                 
                 <h2 className="text-xl font-bold text-white mb-1">Module Online!</h2>
                 <p className="text-slate-400 text-sm mb-6">{currentChallenge.successMessage}</p>
                 
                 <div className="flex flex-col gap-2">
                    {gameState.currentLevel < CHALLENGES.length ? (
                        <button 
                          onClick={handleNextLevel}
                          className="w-full py-2.5 bg-neon-green text-slate-900 font-bold rounded-lg hover:bg-green-400 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                           NEXT LEVEL <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <div className="p-4 bg-slate-800 rounded-lg text-cyan-300 border border-cyan-500/30">
                           <h3 className="font-bold mb-1">🎉 OBSERVATORY FULLY OPERATIONAL</h3>
                           <p className="text-xs text-slate-400">You have mastered Object Creation, Constructors, and Method Calls!</p>
                           <button onClick={() => window.location.reload()} className="mt-3 text-xs underline hover:text-white">Replay Mission</button>
                        </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;