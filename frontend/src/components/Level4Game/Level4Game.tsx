import React, { useState, useEffect } from 'react';
import { CHALLENGES } from './constants.ts';
import { MachineState, ValidationResult } from './types.ts';
import { validateCode } from './services/geminiService.ts';
import Mek4 from './components/Mek4.tsx';
import CodeEditor from './components/CodeEditor.tsx';
import Machine from './components/Machine.tsx';
import { Play, RefreshCw, ChevronRight, Terminal, Lightbulb, Pause, X, RotateCcw, Timer, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [code, setCode] = useState(CHALLENGES[0].initialCode);
  const [machineState, setMachineState] = useState<MachineState>(MachineState.BROKEN);
  const [feedback, setFeedback] = useState<string>("");
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [mekMood, setMekMood] = useState<'happy' | 'waiting' | 'worried' | 'celebrating'>('waiting');
  
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isGameFailed, setIsGameFailed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  const currentChallenge = CHALLENGES[currentLevelIndex];
  const [timeLeft, setTimeLeft] = useState(currentChallenge.timeLimit || 120);

  useEffect(() => {
    // Reset state on level change
    setCode(currentChallenge.initialCode);
    setMachineState(MachineState.BROKEN);
    setFeedback(currentChallenge.description);
    setConsoleOutput("System initialized. Waiting for input...");
    setMekMood('waiting');
    setShowHint(false);
    setIsPaused(false);
    setIsGameFailed(false);
    setTimeLeft(currentChallenge.timeLimit || 120);
  }, [currentLevelIndex, currentChallenge]);

  // Timer Logic
  useEffect(() => {
    if (isPaused || isGameComplete || isGameFailed || machineState === MachineState.FIXED) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleGameFail();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isPaused, isGameComplete, isGameFailed, machineState]);

  const handleGameFail = () => {
    setIsGameFailed(true);
    setMekMood('worried');
    setConsoleOutput("CRITICAL FAILURE: Time limit exceeded.");
  };

  const handleRunCode = async () => {
    if (machineState === MachineState.FIXING || machineState === MachineState.FIXED) return;

    setMachineState(MachineState.FIXING);
    setFeedback("Compiling and validating method signature...");
    setMekMood('waiting');
    setConsoleOutput("Compiling...");
    setShowHint(false);

    const result: ValidationResult = await validateCode(code, currentChallenge);

    if (result.success) {
      setMachineState(MachineState.FIXED);
      setFeedback(result.message || "Excellent work! The machine is operational.");
      setConsoleOutput(result.consoleOutput || "Build Success.\nTests Passed.\nMachine Active.");
      setMekMood('celebrating');
    } else {
      setMachineState(MachineState.ERROR);
      setFeedback(result.message || "Compilation failed. Check your syntax.");
      setConsoleOutput(result.consoleOutput || "Error: Syntax or Logic failure.");
      setMekMood('worried');
    }
  };

  const handleNextLevel = () => {
    if (currentLevelIndex < CHALLENGES.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
    } else {
      setIsGameComplete(true);
      setMekMood('celebrating');
      setFeedback("All systems operational. The Method Forge is restored!");
    }
  };

  const toggleHint = () => {
    if (showHint) {
      setFeedback(currentChallenge.description);
      setShowHint(false);
    } else {
      setFeedback(`HINT: ${currentChallenge.hint}`);
      setShowHint(true);
      setMekMood('happy');
    }
  };

  const handleReset = () => {
    setCode(currentChallenge.initialCode);
    setMachineState(MachineState.BROKEN);
    setFeedback("Code reset to original state.");
    setConsoleOutput("System reset.");
    setMekMood('waiting');
  };

  const handleClose = () => {
    setIsGameFailed(true);
  };

  const handleRetryLevel = () => {
    setIsGameFailed(false);
    setIsPaused(false);
    setMachineState(MachineState.BROKEN);
    setTimeLeft(currentChallenge.timeLimit || 120);
    setCode(currentChallenge.initialCode);
    setConsoleOutput("System rebooting...");
    setFeedback(currentChallenge.description);
    setMekMood('waiting');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isGameComplete) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8 text-center relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-slate-900/50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950" />
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="z-10 max-w-2xl bg-slate-800/90 backdrop-blur border border-cyan-500/50 p-12 rounded-3xl shadow-2xl"
        >
          <h1 className="text-5xl font-bold text-cyan-400 mb-6">The Forge is Restored!</h1>
          <p className="text-xl text-slate-300 mb-8">
            You have successfully repaired all the machines using the power of Java Methods.
            The Method Forge is now fully operational.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 mx-auto transition-all shadow-lg hover:shadow-cyan-500/25"
          >
            <RefreshCw size={20} />
            Replay Level 4
          </button>
        </motion.div>
      </div>
    );
  }

  if (isGameFailed) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8 text-center relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-red-950/20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 to-slate-950" />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="z-10 max-w-md bg-slate-900/90 backdrop-blur border border-red-500/30 p-8 rounded-3xl shadow-2xl"
        >
          <div className="w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/50">
             <AlertTriangle size={40} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-red-400 mb-2">Mission Failed</h1>
          <p className="text-slate-400 mb-8">
            The simulation has ended. The machine was not repaired in time or the session was terminated.
          </p>
          <button 
            onClick={handleRetryLevel}
            className="w-full px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 mx-auto transition-all shadow-lg hover:shadow-red-500/25"
          >
            <RotateCcw size={20} />
            Retry Level
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0f172a] text-slate-200 font-sans flex overflow-hidden relative">
      
      {/* Pause Overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full mx-4">
              <h2 className="text-2xl font-bold text-white mb-2">Simulation Paused</h2>
              <p className="text-slate-400 mb-8">Take a break, engineer.</p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setIsPaused(false)}
                  className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Play size={18} /> Resume
                </button>
                <button 
                  onClick={() => { setIsPaused(false); handleReset(); }}
                  className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw size={18} /> Reset Level
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT PANEL: Visuals & Instructions */}
      <div className="w-1/3 lg:w-5/12 h-full bg-slate-900 border-r border-slate-800 flex flex-col relative z-10">
        {/* Header */}
        <div className="p-6 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-2">
               <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono tracking-widest text-slate-400 uppercase">Level {currentChallenge.id}</span>
               <h1 className="text-lg font-bold text-white truncate max-w-[150px] md:max-w-xs">{currentChallenge.title}</h1>
             </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
             {currentChallenge.description}
          </p>
        </div>

        {/* Machine Area */}
        <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
           {/* Background Grid */}
           <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
           
           <Machine name={currentChallenge.machineName} state={machineState} />
        </div>

        {/* Mek4 & Feedback Area */}
        <div className="p-6 bg-slate-900 border-t border-slate-800">
           <Mek4 message={feedback} mood={mekMood} className="w-full" />
        </div>
      </div>

      {/* RIGHT PANEL: Editor & Tools */}
      <div className="flex-1 h-full flex flex-col bg-[#1e1e1e]">
        
        {/* Toolbar */}
        <div className="h-16 bg-[#252526] border-b border-[#3e3e42] flex items-center justify-between px-6 shadow-md z-20">
           <div className="flex items-center gap-4">
              <div className="flex flex-col">
                 <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">File</span>
                 <span className="text-sm font-medium text-slate-200">Solution.java</span>
              </div>
              
              {/* Timer Display */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${
                timeLeft < 30 ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}>
                <Timer size={14} className={timeLeft < 30 ? 'animate-pulse' : ''} />
                <span className="font-mono font-bold text-sm">{formatTime(timeLeft)}</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
             <div className="h-8 w-[1px] bg-slate-700 mx-1" />
             
             <button 
               onClick={() => setIsPaused(true)}
               className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
               title="Pause Game"
             >
               <Pause size={20} />
             </button>

             <button 
               onClick={handleReset}
               className="p-2 text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-all"
               title="Reset Code"
             >
               <RotateCcw size={20} />
             </button>

             <button 
               onClick={handleClose}
               className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
               title="Close / End Game"
             >
               <X size={20} />
             </button>

             <div className="h-8 w-[1px] bg-slate-700 mx-1" />

             <button 
               onClick={toggleHint}
               className={`p-2 rounded-lg transition-all ${showHint ? 'text-yellow-400 bg-yellow-400/10' : 'text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10'}`}
               title="Show Hint"
             >
               <Lightbulb size={20} />
             </button>

             <div className="h-8 w-[1px] bg-slate-700 mx-1" />

             {machineState === MachineState.FIXED ? (
               <button
                 onClick={handleNextLevel}
                 className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-lg transition-all shadow-lg hover:shadow-green-500/20 transform hover:-translate-y-0.5"
               >
                 Next Level <ChevronRight size={18} />
               </button>
             ) : (
               <button
                 onClick={handleRunCode}
                 disabled={machineState === MachineState.FIXING}
                 className={`flex items-center gap-2 px-6 py-2.5 ${
                   machineState === MachineState.FIXING ? 'bg-slate-600 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500 hover:shadow-cyan-500/20 transform hover:-translate-y-0.5'
                 } text-white text-sm font-bold rounded-lg transition-all shadow-lg`}
               >
                 {machineState === MachineState.FIXING ? (
                   <RefreshCw size={18} className="animate-spin" />
                 ) : (
                   <Play size={18} fill="currentColor" />
                 )}
                 {machineState === MachineState.FIXING ? 'Compiling...' : 'Run Code'}
               </button>
             )}
           </div>
        </div>

        {/* Instructions & Code Container */}
        <div className="flex-1 flex flex-col relative">
           {/* Code Editor */}
           <div className="flex-1 relative">
             <CodeEditor 
                code={code} 
                onChange={setCode} 
                disabled={machineState === MachineState.FIXING || machineState === MachineState.FIXED || isGameFailed} 
             />
             
             {/* Instructions Overlay */}
             <div className="absolute top-4 right-8 max-w-sm pointer-events-none">
                <div className="bg-slate-800/80 backdrop-blur p-3 rounded-lg border border-slate-700/50 shadow-xl">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Parameters</h4>
                    <ul className="space-y-1">
                        {currentChallenge.instructions.map((inst, i) => (
                            <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                                <span className="text-cyan-500 mt-0.5">•</span> {inst}
                            </li>
                        ))}
                    </ul>
                </div>
             </div>
           </div>

           {/* Console Area */}
           <div className="h-1/3 bg-[#0f0f0f] border-t border-slate-800 flex flex-col">
              <div className="px-4 py-1.5 bg-[#181818] border-b border-slate-800 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider font-bold">
                   <Terminal size={12} />
                   Terminal
                 </div>
                 <div className="flex gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-slate-700" />
                   <div className="w-2 h-2 rounded-full bg-slate-700" />
                   <div className="w-2 h-2 rounded-full bg-slate-700" />
                 </div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto font-mono text-sm leading-relaxed">
                 {consoleOutput.split('\n').map((line, i) => (
                   <div key={i} className={`mb-1 ${
                     line.toLowerCase().includes('error') || line.toLowerCase().includes('fail') ? 'text-red-400 bg-red-900/10 px-1 -mx-1 rounded' :
                     line.toLowerCase().includes('success') || line.toLowerCase().includes('active') ? 'text-green-400' :
                     'text-slate-300'
                   }`}>
                     <span className="opacity-30 mr-2">$</span>{line}
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default App;