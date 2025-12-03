import React, { useState, useEffect, useCallback } from 'react';
import { Bot, Play, CheckCircle, Lock, RefreshCw, Lightbulb, ChevronRight, Code2, Pause, X } from 'lucide-react';
import { CHALLENGES } from './constants.ts';
import { ChallengeStatus, VisualState } from './types.ts';
import { CodeEditor } from './components/CodeEditor.tsx';
import { Visualizer } from './components/Visualizer.tsx';
import { validateChallenge, getHint } from './services/geminiService.ts';

const App: React.FC = () => {
  const [currentChallengeId, setCurrentChallengeId] = useState<number>(1);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [code, setCode] = useState<string>(CHALLENGES[0].starterCode);
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState<string>("Waiting for code...");
  const [hint, setHint] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [visualState, setVisualState] = useState<VisualState>({
    doorOpen: false,
    platformActive: false,
    elevatorLevel: 0,
    sparkles: false,
    devicesActive: [false, false, false]
  });

  const currentChallenge = CHALLENGES.find(c => c.id === currentChallengeId) || CHALLENGES[0];

  // Reset visuals when switching challenges
  useEffect(() => {
    setVisualState({
      doorOpen: false,
      platformActive: false,
      elevatorLevel: 0,
      sparkles: false,
      devicesActive: [false, false, false]
    });
    setFeedback("Waiting for code...");
    setHint(null);
    setCode(currentChallenge.starterCode);
    setIsPaused(false);
  }, [currentChallengeId]);

  const handleRun = async () => {
    setIsRunning(true);
    setIsPaused(false);
    setFeedback("Compiling & analyzing with POLY-BOT...");
    
    const response = await validateChallenge(currentChallengeId, code);

    setIsRunning(false);
    setFeedback(response.feedback);

    if (response.success) {
      if (!completedIds.includes(currentChallengeId)) {
        setCompletedIds([...completedIds, currentChallengeId]);
      }
      triggerVisuals(response.visualAction || 'NONE');
    }
  };

  const handleClose = () => {
    setVisualState({
      doorOpen: false,
      platformActive: false,
      elevatorLevel: 0,
      sparkles: false,
      devicesActive: [false, false, false]
    });
    setFeedback("Simulation reset.");
    setIsPaused(false);
  };

  const triggerVisuals = (action: string) => {
    // Reset first
    setVisualState(prev => ({...prev, sparkles: false}));

    // Sequence logic
    if (action === 'OPEN_DOOR') {
      setTimeout(() => setVisualState(prev => ({ ...prev, doorOpen: true })), 500);
    } else if (action === 'ACTIVATE_PLATFORM') {
       setTimeout(() => setVisualState(prev => ({ ...prev, platformActive: true, sparkles: true })), 500);
    } else if (action === 'POLYMORPHISM_DEMO') {
       // Sequential activation
       setTimeout(() => setVisualState(prev => ({ ...prev, doorOpen: true })), 500);
       setTimeout(() => setVisualState(prev => ({ ...prev, platformActive: true, sparkles: true })), 1500);
    } else if (action === 'ELEVATOR_RIDE') {
       setTimeout(() => setVisualState(prev => ({ ...prev, elevatorLevel: 2, sparkles: true })), 500);
    } else if (action === 'ARRAY_LOOP') {
       // Grand finale sequence
       setTimeout(() => setVisualState(prev => ({ ...prev, doorOpen: true })), 500);
       setTimeout(() => setVisualState(prev => ({ ...prev, platformActive: true })), 1500);
       setTimeout(() => setVisualState(prev => ({ ...prev, elevatorLevel: 2, sparkles: true })), 2500);
    }
  };

  const requestHint = async () => {
      const hintText = await getHint(currentChallengeId);
      setHint(hintText);
  }

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-purple-400 flex items-center gap-2">
            <Code2 className="w-6 h-6" />
            OOP Palace
          </h1>
          <p className="text-xs text-slate-500 mt-1">Level 6: Inheritance Trials</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {CHALLENGES.map((c) => {
            const isLocked = c.id > 1 && !completedIds.includes(c.id - 1);
            const isCompleted = completedIds.includes(c.id);
            const isActive = c.id === currentChallengeId;
            
            return (
              <button
                key={c.id}
                disabled={isLocked}
                onClick={() => setCurrentChallengeId(c.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 relative group
                  ${isActive ? 'bg-purple-900/20 border-purple-500/50 shadow-lg shadow-purple-900/20' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'}
                  ${isLocked ? 'opacity-50 cursor-not-allowed grayscale' : ''}
                `}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-xs font-mono mb-1 block ${isActive ? 'text-purple-400' : 'text-slate-500'}`}>
                    CHALLENGE {c.id}
                  </span>
                  {isCompleted ? <CheckCircle size={14} className="text-green-400" /> : isLocked ? <Lock size={14} className="text-slate-600" /> : null}
                </div>
                <h3 className="font-semibold text-sm text-slate-200">{c.title}</h3>
              </button>
            );
          })}
        </div>

        {/* Progress Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Progress</span>
                <span>{completedIds.length} / {CHALLENGES.length}</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-500"
                    style={{ width: `${(completedIds.length / CHALLENGES.length) * 100}%` }}
                ></div>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Bar - Challenge Info */}
        <div className="h-16 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between px-6">
            <h2 className="text-lg font-medium flex items-center gap-2">
                <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">{currentChallenge.id}</span>
                {currentChallenge.title}
            </h2>
            <div className="flex items-center gap-4">
               {completedIds.length === CHALLENGES.length && (
                   <div className="px-4 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-bold animate-pulse border border-yellow-500/50">
                       PALACE UNLOCKED
                   </div>
               )}

               {/* Global Controls */}
               <div className="flex items-center gap-2 pl-4 border-l border-slate-700 ml-2">
                  <button 
                      onClick={() => setIsPaused(!isPaused)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${isPaused ? 'bg-yellow-500/20 text-yellow-400' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
                      title={isPaused ? "Resume Simulation" : "Pause Simulation"}
                  >
                      {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
                  </button>
                  <button 
                      onClick={handleClose}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors duration-200"
                      title="Reset Simulation"
                  >
                      <X size={20} />
                  </button>
               </div>
            </div>
        </div>

        {/* Split View */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* Left: Editor */}
            <div className="w-1/2 flex flex-col border-r border-slate-800 bg-slate-950 p-4">
                
                {/* Prompt Area */}
                <div className="mb-4 bg-slate-900 rounded-lg p-4 border border-slate-800 text-sm leading-relaxed shadow-sm">
                    <div className="flex items-center gap-2 text-purple-400 font-bold mb-2 uppercase text-xs tracking-wider">
                        <Bot size={14} /> Poly-Bot Mission
                    </div>
                    <p className="text-slate-300 mb-2">{currentChallenge.scenario}</p>
                    <p className="text-blue-300 font-medium bg-blue-900/20 p-2 rounded border border-blue-900/50">
                        Task: {currentChallenge.task}
                    </p>
                </div>

                {/* Code Area */}
                <div className="flex-1 relative min-h-0">
                    <CodeEditor code={code} onChange={setCode} />
                </div>

                {/* Action Bar */}
                <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex gap-2">
                         <button 
                            onClick={requestHint}
                            className="flex items-center gap-2 px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-yellow-300 text-sm font-medium transition-colors"
                        >
                            <Lightbulb size={16} /> Hint
                        </button>
                         <button 
                             onClick={() => setCode(currentChallenge.starterCode)}
                             className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                             title="Reset Code"
                         >
                            <RefreshCw size={16} />
                         </button>
                    </div>
                    
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-white shadow-lg transition-all transform active:scale-95
                            ${isRunning 
                                ? 'bg-slate-700 cursor-wait' 
                                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 hover:shadow-purple-500/20'
                            }`}
                    >
                        {isRunning ? 'Compiling...' : <><Play size={18} /> Run Code</>}
                    </button>
                </div>
                
                {/* Feedback Console */}
                {feedback && (
                    <div className={`mt-4 p-3 rounded font-mono text-xs border 
                        ${feedback.includes("Great") || feedback.includes("success") 
                            ? 'bg-green-900/20 border-green-900 text-green-400' 
                            : feedback === "Waiting for code..." ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-red-900/20 border-red-900 text-red-400'
                        }`}>
                        <span className="font-bold mr-2">{'>'}</span>
                        {feedback}
                    </div>
                )}
                
                {/* Hint Display */}
                {hint && (
                    <div className="mt-2 p-3 bg-yellow-900/10 border border-yellow-900/30 text-yellow-500 text-xs rounded animate-in fade-in slide-in-from-bottom-2">
                        <span className="font-bold">💡 HINT:</span> {hint}
                    </div>
                )}

            </div>

            {/* Right: Visualization */}
            <div className="w-1/2 relative bg-black">
                <Visualizer state={visualState} currentChallengeId={currentChallengeId} isPaused={isPaused} />
                
                {/* Success Overlay */}
                {completedIds.includes(currentChallengeId) && visualState.doorOpen && currentChallengeId === 1 && (
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-green-500/90 text-white px-4 py-2 rounded-full shadow-xl animate-bounce font-bold z-50">
                        System Unlocked!
                    </div>
                )}
                
                {/* Completion Modal for Level 5 */}
                {completedIds.length === 5 && currentChallengeId === 5 && visualState.sparkles && (
                     <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-1000">
                         <div className="bg-slate-900 border border-purple-500 p-8 rounded-2xl max-w-md text-center shadow-2xl shadow-purple-500/20">
                             <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                                 <CheckCircle size={32} className="text-white" />
                             </div>
                             <h2 className="text-2xl font-bold text-white mb-2">Level Completed!</h2>
                             <p className="text-slate-300 mb-6">
                                 You have mastered Inheritance, Overriding, and Polymorphism. The Palace is fully operational under your command.
                             </p>
                             <button 
                                onClick={() => {
                                    setCompletedIds([]);
                                    setCurrentChallengeId(1);
                                }}
                                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Replay Level
                             </button>
                         </div>
                     </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};

export default App;