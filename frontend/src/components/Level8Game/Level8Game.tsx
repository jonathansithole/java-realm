import React, { useState, useEffect, useCallback } from 'react';
import { LEVELS } from './constants.ts';
import { LevelData, ChatMessage, VisualState } from './types.ts';
import CodeEditor from './components/CodeEditor.tsx';
import Visualizer from './components/Visualizer.tsx';
import ChatPanel from './components/ChatPanel.tsx';
import { getHintFromAI, getSuccessMessage } from './services/geminiService.ts';
import { Wand2, ArrowRight, RotateCcw, Bot, Pause, X, Play, AlertOctagon } from 'lucide-react';

type ModalState = 'NONE' | 'PAUSED' | 'EXIT_CONFIRM';

export default function App() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [code, setCode] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [visualState, setVisualState] = useState<VisualState>('UNSTABLE');
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [modalState, setModalState] = useState<ModalState>('NONE');

  const currentLevel: LevelData = LEVELS[currentLevelIndex];

  // Initialize level
  useEffect(() => {
    if (currentLevel) {
      setCode(currentLevel.brokenCode);
      setVisualState('UNSTABLE');
      addMessage('SYSTEM', `Connected to ${currentLevel.machineName}...`);
      addMessage('DEBUG-BOT', `Level ${currentLevel.id}: ${currentLevel.scenario}`);
    }
  }, [currentLevelIndex]);

  const addMessage = (sender: ChatMessage['sender'], text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString() + Math.random(), sender, text }
    ]);
  };

  const normalizeCode = (str: string) => str.replace(/\s+/g, ' ').trim();

  const handleRun = async () => {
    if (modalState !== 'NONE') return;

    setIsChecking(true);
    const normalizedInput = normalizeCode(code);
    const normalizedCorrect = normalizeCode(currentLevel.correctCode);

    // Basic validation logic + Keyword check for more robust partial matching
    const keywordsPresent = currentLevel.validationKeywords.every(kw => code.includes(kw));
    const isMatch = normalizedInput === normalizedCorrect || (keywordsPresent && normalizedInput.length >= normalizedCorrect.length - 5 && normalizedInput.length <= normalizedCorrect.length + 5);

    if (isMatch) {
      setVisualState('STABILIZING');
      setTimeout(async () => {
        setVisualState('STABLE');
        const successMsg = await getSuccessMessage(currentLevel);
        addMessage('DEBUG-BOT', successMsg);
        
        setTimeout(() => {
          if (currentLevelIndex < LEVELS.length - 1) {
             setCurrentLevelIndex(prev => prev + 1);
          } else {
             handleGameComplete();
          }
          setIsChecking(false);
        }, 2000);
      }, 1000);
    } else {
      addMessage('SYSTEM', 'Compilation Failed: Syntax Error detected.');
      setVisualState('UNSTABLE');
      setIsChecking(false);
    }
  };

  const handleHint = async () => {
    if (modalState !== 'NONE') return;
    setIsChecking(true);
    addMessage('EXPLORER', "I'm stuck. Debug-Bot, can you analyze this?");
    const hint = await getHintFromAI(code, currentLevel);
    addMessage('DEBUG-BOT', hint);
    setIsChecking(false);
  };

  const handleGameComplete = () => {
    setIsGameComplete(true);
    addMessage('DEBUG-BOT', "All systems stabilized! The Dungeon Portal is opening!");
    addMessage('EXPLORER', "We did it! Ready for Level 9.");
  };

  const restartGame = () => {
    setIsGameComplete(false);
    setCurrentLevelIndex(0);
    setMessages([]);
    setModalState('NONE');
  };

  if (isGameComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-950 to-slate-950"></div>
         
         {/* Close Button for Success Screen */}
         <button 
            onClick={restartGame}
            className="absolute top-6 right-6 z-50 p-3 rounded-full bg-slate-800/50 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all border border-slate-700 hover:border-red-500/50 backdrop-blur-sm"
          >
            <X size={24} />
          </button>

         <div className="z-10 text-center max-w-2xl space-y-8 animate-[fadeIn_1s_ease-out]">
            <div className="inline-block p-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
              <Wand2 size={64} className="text-emerald-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-cyan-300">
              DUNGEON SECURE
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              You have successfully debugged all systems. The facility is fully operational. 
              Your coding skills have saved the day!
            </p>
            
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 text-left max-w-md mx-auto">
               <h3 className="text-emerald-400 font-mono font-bold mb-4 border-b border-slate-700 pb-2">MISSION LOG</h3>
               <ul className="space-y-2 text-sm text-slate-400 font-mono">
                 <li className="flex items-center"><span className="text-emerald-500 mr-2">✓</span> Syntax Errors Repaired</li>
                 <li className="flex items-center"><span className="text-emerald-500 mr-2">✓</span> Object Instantiation Fixed</li>
                 <li className="flex items-center"><span className="text-emerald-500 mr-2">✓</span> Logic Gates Realigned</li>
                 <li className="flex items-center"><span className="text-emerald-500 mr-2">✓</span> Mainframe Compiled</li>
               </ul>
            </div>

            <button 
              onClick={restartGame}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-emerald-600 font-lg rounded-full hover:bg-emerald-500 focus:outline-none ring-offset-2 focus:ring-2 ring-emerald-400"
            >
              <RotateCcw className="mr-2 group-hover:-rotate-180 transition-transform duration-500" />
              Reboot Simulation
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 relative">
      
      {/* Modal Overlay System */}
      {modalState !== 'NONE' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
           <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center relative overflow-hidden">
              {/* Scanline for modal */}
              <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]"></div>
              
              {modalState === 'PAUSED' ? (
                <>
                  <div className="mx-auto w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-indigo-500/10">
                    <Pause size={32} className="text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">SIMULATION PAUSED</h2>
                  <p className="text-slate-400 mb-8">Systems in standby mode.</p>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setModalState('NONE')}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-all flex items-center justify-center space-x-2"
                    >
                      <Play size={18} fill="currentColor" />
                      <span>RESUME</span>
                    </button>
                    <button 
                      onClick={() => setModalState('EXIT_CONFIRM')}
                      className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold transition-all flex items-center justify-center space-x-2"
                    >
                      <X size={18} />
                      <span>ABORT</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-red-500/10">
                    <AlertOctagon size={32} className="text-red-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">TERMINATE SESSION?</h2>
                  <p className="text-slate-400 mb-8">All unsaved progress will be lost.</p>
                  <div className="space-y-3">
                    <button 
                      onClick={restartGame}
                      className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition-all"
                    >
                      CONFIRM TERMINATION
                    </button>
                    <button 
                      onClick={() => setModalState('NONE')}
                      className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold transition-all"
                    >
                      CANCEL
                    </button>
                  </div>
                </>
              )}
           </div>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className={`max-w-7xl mx-auto p-4 md:p-6 lg:p-8 h-screen flex flex-col gap-6 transition-all duration-300 ${modalState !== 'NONE' ? 'blur-sm scale-[0.99] opacity-50' : ''}`}>
        
        {/* Header */}
        <header className="flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
               <Wand2 className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">LEVEL 8</h1>
              <p className="text-xs text-indigo-400 font-mono uppercase tracking-widest">The Debugging Dungeon</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
             {/* Progress Indicators */}
             <div className="hidden md:flex items-center space-x-2">
               {LEVELS.map((lvl) => (
                 <div 
                   key={lvl.id} 
                   className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${
                     lvl.id < currentLevel.id ? 'bg-emerald-500' : 
                     lvl.id === currentLevel.id ? 'bg-yellow-500 animate-pulse' : 'bg-slate-800'
                   }`}
                 />
               ))}
             </div>

             {/* Header Controls */}
             <div className="flex items-center space-x-2 pl-4 border-l border-slate-800">
               <button 
                 onClick={() => setModalState('PAUSED')}
                 className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                 title="Pause Simulation"
               >
                 <Pause size={20} />
               </button>
               <button 
                 onClick={() => setModalState('EXIT_CONFIRM')}
                 className="p-2 rounded-lg text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-colors"
                 title="Terminate Session"
               >
                 <X size={20} />
               </button>
             </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
          
          {/* Left Column: Visuals & Chat (4/12 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6 min-h-[500px] lg:min-h-0">
            <div className="flex-1 min-h-[250px]">
              <Visualizer state={visualState} machineName={currentLevel.machineName} />
            </div>
            <div className="flex-1 min-h-[250px] flex flex-col">
               <ChatPanel messages={messages} />
            </div>
          </div>

          {/* Right Column: Code Editor (8/12 cols) */}
          <div className="lg:col-span-8 flex flex-col h-full min-h-[500px] lg:min-h-0 relative">
            
            {/* Task Description Overlay */}
            <div className="absolute top-0 right-0 z-10 m-4 max-w-sm w-full pointer-events-none">
               <div className="bg-slate-900/90 backdrop-blur-md border border-yellow-500/30 p-4 rounded-lg shadow-2xl pointer-events-auto">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-yellow-400 font-bold text-sm uppercase flex items-center">
                       <AlertTriangleIcon className="w-4 h-4 mr-2" />
                       Error Detected
                    </h3>
                    <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded">
                      Challenge {currentLevel.id}/5
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {currentLevel.scenario}
                  </p>
               </div>
            </div>

            <CodeEditor 
              code={code} 
              onChange={setCode} 
              onRun={handleRun} 
              disabled={visualState === 'STABILIZING' || isChecking || modalState !== 'NONE'}
            />

            {/* Hint Button */}
            <div className="absolute bottom-4 left-4 z-10">
              <button 
                onClick={handleHint}
                disabled={isChecking || visualState === 'STABILIZING' || modalState !== 'NONE'}
                className="flex items-center space-x-2 text-xs font-bold text-indigo-300 hover:text-indigo-200 bg-indigo-900/50 hover:bg-indigo-800/50 px-3 py-2 rounded-lg backdrop-blur-sm transition-colors border border-indigo-500/20"
              >
                <Bot size={14} />
                <span>REQUEST DEBUG ASSISTANCE</span>
              </button>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}

// Helper component for icon
const AlertTriangleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);