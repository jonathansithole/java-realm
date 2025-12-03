import React, { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Bot, Play, RefreshCw, ArrowRight, RotateCcw, Terminal, CheckCircle, ShieldCheck, Pause, X, Home } from 'lucide-react';
import { LEVELS, STABILITY_DATA_INIT } from './constants.ts';
import { GameStatus, MachineStatus, LogEntry, Level } from './types.ts';
import { CodeEditor } from './components/CodeEditor.tsx';
import { Visualizer } from './components/Visualizer.tsx';
import { Console } from './components/Console.tsx';
import { getGeminiHint } from './services/geminiService.ts';

const App: React.FC = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.INTRO);
  const [machineStatus, setMachineStatus] = useState<MachineStatus>(MachineStatus.IDLE);
  const [code, setCode] = useState(LEVELS[0].initialCode);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stabilityData, setStabilityData] = useState(STABILITY_DATA_INIT.map(d => ({ ...d, stability: d.name === 'Lvl 1' ? 20 : 10 })));
  const [isThinking, setIsThinking] = useState(false); // For Gemini
  const [isPaused, setIsPaused] = useState(false);

  const currentLevel: Level = LEVELS[currentLevelIndex];

  const addLog = (message: string, type: 'info' | 'error' | 'success') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      message,
      type,
      timestamp: new Date()
    }]);
  };

  const startGame = () => {
    setGameStatus(GameStatus.PLAYING);
    addLog("Welcome to the Fortress of Fail-Safes.", "info");
    addLog(`LEVEL ${currentLevel.id} INITIATED: ${currentLevel.title}`, "info");
    addLog(currentLevel.story, "info");
  };

  const handleRunCode = async () => {
    if (machineStatus === MachineStatus.RUNNING) return;

    setMachineStatus(MachineStatus.RUNNING);
    addLog("Compiling and deploying patch...", "info");

    // Simulate processing delay
    setTimeout(async () => {
      // Validation Logic
      const passed = currentLevel.validationRegex.every(regex => regex.test(code));

      if (passed) {
        setMachineStatus(MachineStatus.STABILIZED);
        addLog("Exception handled correctly! Systems stabilizing.", "success");
        
        // Update charts
        setStabilityData(prev => {
            const newData = [...prev];
            if (currentLevelIndex < newData.length) {
                newData[currentLevelIndex].stability = 95 + Math.random() * 5;
            }
            return newData;
        });

      } else {
        setMachineStatus(MachineStatus.ERROR);
        addLog("CRITICAL FAILURE: Uncaught Exception detected!", "error");
        addLog("Machine integrity compromised.", "error");
        
        // Trigger Gemini Hint automatically on error
        handleAskExcBot(true);
      }
    }, 1500);
  };

  const handleAskExcBot = async (isAuto = false) => {
    setIsThinking(true);
    if (!isAuto) addLog("Requesting assistance from EXC-BOT...", "info");
    
    const hint = await getGeminiHint(code, currentLevel.title, currentLevel.expectedException[0] || "Unknown Error");
    
    addLog(`EXC-BOT: "${hint}"`, "info");
    setIsThinking(false);
  };

  const handleNextLevel = () => {
    if (currentLevelIndex < LEVELS.length - 1) {
      const nextIdx = currentLevelIndex + 1;
      setCurrentLevelIndex(nextIdx);
      setCode(LEVELS[nextIdx].initialCode);
      setMachineStatus(MachineStatus.IDLE);
      setLogs([]); 
      addLog(`LEVEL ${LEVELS[nextIdx].id} INITIATED: ${LEVELS[nextIdx].title}`, "info");
      addLog(LEVELS[nextIdx].story, "info");
    } else {
      setGameStatus(GameStatus.COMPLETED);
    }
  };

  const handleResetLevel = () => {
    setCode(currentLevel.initialCode);
    setMachineStatus(MachineStatus.IDLE);
    addLog("Code reverted to initial broken state.", "info");
  };

  const togglePause = () => setIsPaused(!isPaused);

  const handleExitToMenu = () => {
    setIsPaused(false);
    setGameStatus(GameStatus.INTRO);
    setMachineStatus(MachineStatus.IDLE);
    setCurrentLevelIndex(0);
    setLogs([]);
    setCode(LEVELS[0].initialCode);
    setStabilityData(STABILITY_DATA_INIT.map(d => ({ ...d, stability: d.name === 'Lvl 1' ? 20 : 10 })));
  };

  // --- Components ---

  const PauseOverlay = () => {
    if (!isPaused) return null;
    return (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center space-y-4">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-slate-800 rounded-full border border-slate-600 shadow-inner">
                        <Pause className="w-8 h-8 text-slate-300" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Game Paused</h2>
                <p className="text-slate-400 text-sm mb-6">Simulation suspended. Systems holding.</p>
                
                <button onClick={togglePause} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-900/20">
                    <Play className="w-4 h-4" /> Resume Operations
                </button>
                
                {gameStatus === GameStatus.PLAYING && (
                    <button onClick={() => { handleResetLevel(); togglePause(); }} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700">
                        <RotateCcw className="w-4 h-4" /> Restart Level
                    </button>
                )}
                
                <button onClick={handleExitToMenu} className="w-full py-3 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors">
                    <Home className="w-4 h-4" /> Exit to Main Menu
                </button>
            </div>
        </div>
    )
  };

  const TopRightControls = ({ absolute = true }: { absolute?: boolean }) => (
      <div className={`${absolute ? 'absolute top-6 right-6' : 'flex items-center'} flex gap-2 z-50`}>
        <button 
            onClick={togglePause} 
            className="p-2 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-all backdrop-blur-sm" 
            title="Pause"
        >
            <Pause className="w-5 h-5" />
        </button>
        <button 
            onClick={handleExitToMenu} 
            className="p-2 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-red-400 hover:bg-slate-700 hover:border-red-900/50 transition-all backdrop-blur-sm" 
            title="Exit"
        >
            <X className="w-5 h-5" />
        </button>
      </div>
  );

  // --- Views ---

  if (gameStatus === GameStatus.INTRO) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center bg-[url('https://picsum.photos/1920/1080?grayscale&blur=2')] bg-cover bg-center relative">
        <PauseOverlay />
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
        
        <TopRightControls />

        <div className="relative z-10 max-w-2xl p-8 bg-slate-900/90 border border-slate-700 rounded-2xl shadow-2xl text-center">
          <div className="flex justify-center mb-6">
             <div className="p-4 bg-cyan-900/30 rounded-full border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <ShieldCheck className="w-16 h-16 text-cyan-400" />
             </div>
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
            The Fortress of Fail-Safes
          </h1>
          <p className="text-lg text-slate-300 mb-6 leading-relaxed">
            Welcome, Explorer. You have entered a floating citadel where every machine is prone to catastrophic failure.
            <br/><br/>
            I am <span className="text-yellow-400 font-bold">EXC-BOT</span>. Together, we must use the ancient art of 
            <span className="font-mono text-cyan-300 bg-slate-800 px-1 rounded mx-1">try-catch</span> 
            to stabilize the fortress before it collapses.
          </p>
          <button 
            onClick={startGame}
            className="group relative px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center mx-auto gap-2"
          >
            Enter the Fortress
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  if (gameStatus === GameStatus.COMPLETED) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative">
        <PauseOverlay />
        <TopRightControls />
        
        <div className="max-w-3xl w-full bg-slate-900/90 border border-green-500/30 rounded-2xl shadow-2xl p-8 text-center relative z-10">
             <div className="mb-6 inline-flex items-center justify-center p-6 bg-green-900/20 rounded-full border-2 border-green-500/50">
                 <CheckCircle className="w-20 h-20 text-green-400" />
             </div>
             <h1 className="text-4xl font-bold text-white mb-4">Fortress Stabilized!</h1>
             <p className="text-xl text-slate-300 mb-8">
                 Incredible work. You've mastered <span className="text-green-400">ArithmeticExceptions</span>, 
                 <span className="text-green-400"> NullPointers</span>, and even <span className="text-green-400">Polymorphism</span>.
                 The citadel is safe thanks to your exception handling skills.
             </p>
             <div className="h-64 w-full mb-8">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={STABILITY_DATA_INIT.map(d => ({...d, stability: 100}))}>
                      <defs>
                        <linearGradient id="colorFinal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', color: '#e2e8f0'}} />
                      <Area type="monotone" dataKey="stability" stroke="#4ade80" fillOpacity={1} fill="url(#colorFinal)" />
                    </AreaChart>
                 </ResponsiveContainer>
             </div>
             <div className="flex justify-center gap-4">
                 <button onClick={() => window.location.reload()} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 transition-colors">
                     <RotateCcw className="w-4 h-4" /> Replay Level 7
                 </button>
                 <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold shadow-lg shadow-purple-500/20">
                     Proceed to Level 8
                 </button>
             </div>
        </div>
      </div>
    );
  }

  // Main Game Loop View
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      <PauseOverlay />
      
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">7</div>
            <span className="font-bold tracking-wide text-slate-100 hidden sm:inline">The Fortress of Fail-Safes</span>
        </div>
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-sm text-slate-400 hidden sm:flex">
                <span>Systems Status:</span>
                <div className="flex gap-1">
                    {LEVELS.map((lvl, idx) => (
                        <div key={lvl.id} className={`w-8 h-1 rounded-full ${idx < currentLevelIndex ? 'bg-green-500' : idx === currentLevelIndex ? 'bg-yellow-500 animate-pulse' : 'bg-slate-700'}`}></div>
                    ))}
                </div>
            </div>
            
            <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>
            
            <TopRightControls absolute={false} />
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Context & Code */}
        <div className="lg:col-span-7 space-y-6">
            
            {/* Mission Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-yellow-500" />
                        Challenge {currentLevel.id}: {currentLevel.title}
                    </h2>
                    <button 
                        onClick={() => handleAskExcBot(false)} 
                        disabled={isThinking}
                        className="text-xs flex items-center gap-1 text-cyan-400 hover:text-cyan-300 bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-800 transition-colors disabled:opacity-50"
                    >
                        <Bot className="w-3 h-3" />
                        {isThinking ? 'Analyzing...' : 'Ask EXC-BOT'}
                    </button>
                </div>
                <p className="text-slate-400 mb-4">{currentLevel.description}</p>
                <div className="bg-slate-800/50 p-3 rounded border border-slate-700/50 text-sm text-slate-300">
                   <span className="text-yellow-500 font-bold">Scenario: </span>
                   {currentLevel.story}
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex flex-col gap-2">
                <CodeEditor 
                    code={code} 
                    onChange={setCode} 
                    readOnly={machineStatus === MachineStatus.RUNNING || machineStatus === MachineStatus.STABILIZED || isPaused} 
                />
                <div className="flex gap-3 mt-2">
                    <button 
                        onClick={handleRunCode}
                        disabled={machineStatus === MachineStatus.RUNNING || machineStatus === MachineStatus.STABILIZED || isPaused}
                        className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all
                            ${machineStatus === MachineStatus.STABILIZED 
                                ? 'bg-green-600 text-white cursor-default' 
                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'}
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        {machineStatus === MachineStatus.RUNNING ? (
                            <>Running Diagnostics...</>
                        ) : machineStatus === MachineStatus.STABILIZED ? (
                            <>System Stable</>
                        ) : (
                            <><Play className="w-4 h-4" /> Deploy Patch</>
                        )}
                    </button>
                    <button 
                        onClick={handleResetLevel}
                        disabled={machineStatus === MachineStatus.RUNNING || isPaused}
                        className="px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg transition-colors"
                        title="Reset Code"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            {/* Console output */}
            <Console logs={logs} />
        </div>

        {/* Right Column: Visuals & Stats */}
        <div className="lg:col-span-5 space-y-6">
            
            {/* Visualizer */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-sm">
                 <Visualizer status={machineStatus} levelType={currentLevel.type} />
            </div>

            {/* Stability Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm h-64">
                <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Fortress Stability Index</h3>
                <ResponsiveContainer width="100%" height="80%">
                    <AreaChart data={stabilityData}>
                      <defs>
                        <linearGradient id="colorStability" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', fontSize: '12px'}} 
                        itemStyle={{color: '#22d3ee'}}
                      />
                      <Area type="monotone" dataKey="stability" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorStability)" animationDuration={1000} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Action Area (Next Level) */}
            {machineStatus === MachineStatus.STABILIZED && (
                <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-green-400 font-bold text-lg mb-2">Stabilization Complete</h3>
                    <p className="text-slate-400 text-sm mb-4">Systems are running within normal parameters.</p>
                    <button 
                        onClick={handleNextLevel}
                        className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2"
                    >
                        Proceed to Next Sector <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>

      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);
root.render(<App />);
export default App;