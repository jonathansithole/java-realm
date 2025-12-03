// src/pages/Level.jsx

import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, increment, arrayUnion, collection, getDocs } from 'firebase/firestore';
import { lintCode } from '../utils/CodeLinter';

// Animation & Visuals
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Terminal, BookOpen, AlertCircle, CheckCircle, 
  RotateCcw, Sparkles, XCircle, Code2, GraduationCap, 
  Activity, Maximize2, Minimize2, Layers, 
  ChevronRight, HelpCircle, Zap, Globe, Wifi // <--- Added missing imports here
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Components
import CodeEditor from '../components/CodeEditor';
import TutorialScreen from '../components/TutorialScreen';
import GenericSuccess from '../components/GenericSuccess';
import InteractiveCalculator from '../components/InteractiveCalculator';
import ConceptSimulation from '../components/ConceptSimulation';

// --- COMPONENT: TYPEWRITER EFFECT ---
const TypewriterOutput = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');
    useEffect(() => {
        setDisplayedText('');
        let i = 0;
        const speed = text.length > 100 ? 5 : 15; 
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
        return () => clearInterval(timer);
    }, [text]);

    return <span className="whitespace-pre-wrap font-mono">{displayedText}</span>;
};

export default function Level() {
  const { worldId, levelId } = useParams();
  const navigate = useNavigate();
  const consoleEndRef = useRef(null);

  // State
  const [stage, setStage] = useState('loading');
  const [activeTab, setActiveTab] = useState('mission'); 
  const [isSuccess, setIsSuccess] = useState(false);
  const [levelData, setLevelData] = useState(null);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Code & Execution
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [executionError, setExecutionError] = useState(false);
  
  const [lintWarning, setLintWarning] = useState(null);
  const [syntaxHealth, setSyntaxHealth] = useState(100);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  // Data Fetching
  useEffect(() => {
    const fetchLevelData = async () => {
      setStage('loading');
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 99) progress = 99;
        setLoadingProgress(Math.floor(progress));
      }, 150);

      const levelDocRef = doc(db, 'worlds', worldId, 'levels', levelId);
      const levelDoc = await getDoc(levelDocRef);
      
      if (levelDoc.exists()) {
        const data = levelDoc.data();
        setLevelData(data);
        setCode(data.initialCode ? data.initialCode.replace(/\\n/g, '\n') : '');
        setTimeout(() => {
            clearInterval(interval);
            setLoadingProgress(100);
            setTimeout(() => setStage('welcome'), 600);
        }, 1500);
      } else {
        navigate('/map');
      }
    };
    if (worldId && levelId) fetchLevelData();
  }, [worldId, levelId, navigate]);

  // Linting
  useEffect(() => {
    if (!code) return;
    const warning = lintCode(code);
    setLintWarning(warning); 
    if (warning) setSyntaxHealth(prev => Math.max(20, prev - 5));
    else setSyntaxHealth(100);
  }, [code]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code]);

  // Game Logic
  const findNextLevel = async () => {
    const levelsCollectionRef = collection(db, 'worlds', worldId, 'levels');
    const levelsSnapshot = await getDocs(levelsCollectionRef);
    const levels = levelsSnapshot.docs.map(d => d.id).sort((a,b) => a.localeCompare(b.id, undefined, { numeric: true }));
    const currentIndex = levels.indexOf(levelId);
    if (currentIndex > -1 && currentIndex < levels.length - 1) {
      return { nextWorldId: worldId, nextLevelId: levels[currentIndex + 1] };
    } else {
      const nextWorldId = (parseInt(worldId) + 1).toString();
      return { nextWorldId, nextLevelId: `${nextWorldId}.1` };
    }
  };

  const handleSuccess = async () => {
    const user = auth.currentUser;
    if (!user || !levelData || !levelData.badge) return;
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, {
      xp: increment(levelData.xpReward),
      currentLevel: parseFloat((await findNextLevel()).nextLevelId),
      badges: arrayUnion(levelData.badge.name),
    });
  };

  const handleContinue = async () => {
    const { nextWorldId, nextLevelId } = await findNextLevel();
    navigate(`/level/${nextWorldId}/${nextLevelId}`);
  };

  const runCode = async () => {
    if (isLoading) return;
    setOutput('');
    setIsSuccess(false);
    setExecutionError(false);

    if (lintWarning) {
        setOutput(`⚠️ SECURITY PROTOCOL:\nUnsafe code structure detected. Integrity check failed.\n\n> ${lintWarning}`);
        setExecutionError(true);
        return;
    }

    setIsLoading(true);
    try {
      const runResponse = await axios.post('http://localhost:5000/api/run-code', { code });
      const result = runResponse.data;
      const rawOutput = result.error || result.output || "System: No output returned.";
      setOutput(rawOutput);

      if (result.error) {
          setExecutionError(true);
      }

      const isCorrect = result.output && levelData.solution && result.output.trim().toLowerCase() === levelData.solution.toLowerCase();

      if (isCorrect) {
        confetti({ 
            particleCount: 250, 
            spread: 100, 
            origin: { y: 0.6 },
            colors: ['#6366f1', '#8b5cf6', '#ffffff'] 
        });
        await handleSuccess();
        setIsSuccess(true);
      } else if (!result.error) {
        setOutput(prev => prev + "\n\n[SYSTEM] Output does not match expected objective parameters.");
        setExecutionError(true);
      }
    } catch (error) {
      setExecutionError(true);
      setOutput(`❌ FATAL EXCEPTION:\n${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (stage === 'welcome') {
        const timer = setTimeout(() => {
            if (levelData.tutorial && Object.keys(levelData.tutorial).length > 0) {
                setStage('tutorial');
            } else {
                setStage('challenge');
            }
        }, 2200); 
        return () => clearTimeout(timer);
    }
  }, [stage, levelData]);

  const renderSuccessScreen = () => {
    const props = { levelData, onContinue: handleContinue, output, userCode: code };
    switch (levelData.simulationType) {
        case "InteractiveCalculator": return <InteractiveCalculator {...props} />;
        default: return <GenericSuccess {...props} />;
    }
  };

  // --- LOADING STAGE ---
  if (stage === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] flex flex-col items-center justify-center relative overflow-hidden font-sans transition-colors duration-500">
        <div className="relative z-10 flex flex-col items-center w-64">
            {/* Techy Loader */}
            <div className="relative w-24 h-24 mb-8">
                <motion.div 
                    className="absolute inset-0 border-t-4 border-indigo-500 rounded-full" 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                    className="absolute inset-2 border-r-4 border-purple-500 rounded-full" 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                 <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-indigo-500 font-bold animate-pulse">
                    {loadingProgress}%
                 </div>
            </div>
            
            <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-widest uppercase mb-2">Initializing</h2>
            <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${loadingProgress}%` }}
                />
            </div>
        </div>
      </div>
    );
  }

  // --- WELCOME STAGE ---
  if (stage === 'welcome') {
      return (
          <motion.div className="min-h-screen bg-white dark:bg-[#0B0F19] flex items-center justify-center relative overflow-hidden transition-colors duration-500">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
              <div className="text-center relative z-10">
                  <motion.div 
                    initial={{ scale: 0, rotate: -180 }} 
                    animate={{ scale: 1, rotate: 0 }} 
                    className="text-8xl mb-8 drop-shadow-2xl"
                  >
                    🚀
                  </motion.div>
                  <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent mb-6" />
                  <motion.h1 
                    initial={{ y: 50, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    className="text-7xl font-black text-slate-900 dark:text-white mb-2 tracking-tight"
                  >
                    LEVEL {levelId}
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 0.5 }}
                    className="text-indigo-600 dark:text-indigo-400 font-mono tracking-widest text-sm"
                  >
                    SIMULATION READY
                  </motion.p>
              </div>
          </motion.div>
      )
  }

  if (stage === 'tutorial') {
    return <TutorialScreen tutorial={levelData.tutorial} levelTitle={levelData.title} onComplete={() => setStage('challenge')} />;
  }

  if (isSuccess) return renderSuccessScreen();

  // --- MAIN DASHBOARD ---
  return (
    <div className="h-screen w-full bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-200 flex flex-col overflow-hidden font-sans relative transition-colors duration-500">
      
      {/* HEADER */}
      <header className="h-14 bg-white/90 dark:bg-[#0f1422]/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 shrink-0 z-20 shadow-sm dark:shadow-md transition-colors duration-500">
         <div className="flex items-center gap-4">
             <div className="bg-indigo-600 p-1.5 rounded text-white shadow-lg shadow-indigo-500/30">
                 <Code2 size={18} />
             </div>
             <div className="flex flex-col">
                 <h1 className="font-bold text-sm tracking-wide text-slate-900 dark:text-white flex items-center gap-2">
                    {levelData.title}
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono border border-slate-200 dark:border-slate-700">JS</span>
                 </h1>
                 <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                    <span>W{worldId}</span>
                    <span className="text-slate-400">/</span>
                    <span>L{levelId}</span>
                 </div>
             </div>
         </div>
         
         <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-900/80 rounded-full border border-slate-200 dark:border-slate-800 shadow-inner">
                 <Sparkles size={12} className="text-yellow-500" />
                 <span className="text-xs font-bold text-slate-700 dark:text-yellow-200/90">{levelData.xpReward} XP</span>
             </div>
             <div className="h-6 w-px bg-slate-300 dark:bg-slate-800 mx-1" />
             <button 
                onClick={() => setStage('tutorial')} 
                className="group p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
                title="View Guide"
             >
                 <BookOpen size={18} className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
             </button>
             <button 
                onClick={() => navigate('/map')}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Exit Level"
             >
                 <XCircle size={18} className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors" />
             </button>
         </div>
      </header>

      {/* SPLIT PANE */}
      <main className="flex-grow flex relative z-10 overflow-hidden">
        
        {/* LEFT PANEL: SIDEBAR TABS */}
        <motion.section 
            initial={false}
            animate={{ width: isSidebarCollapsed ? '0%' : '30%', opacity: isSidebarCollapsed ? 0 : 1 }}
            className="hidden md:flex flex-col bg-white/50 dark:bg-[#0f1422]/80 border-r border-slate-200 dark:border-slate-800 backdrop-blur-sm min-w-0 transition-colors duration-500"
        >
            {/* Tab Headers */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                <button 
                    onClick={() => setActiveTab('mission')}
                    className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${activeTab === 'mission' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-slate-800/50' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
                >
                    <Layers size={14} /> Mission
                </button>
                <button 
                    onClick={() => setActiveTab('knowledge')}
                    className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${activeTab === 'knowledge' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-slate-800/50' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
                >
                    <GraduationCap size={14} /> Intel
                </button>
            </div>

            {/* Tab Content */}
            <div className="flex-grow overflow-y-auto p-5 custom-scrollbar">
                {activeTab === 'mission' ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                         <div className="bg-indigo-50 dark:bg-gradient-to-br dark:from-indigo-900/20 dark:to-purple-900/10 border border-indigo-100 dark:border-indigo-500/20 p-5 rounded-xl mb-6 relative overflow-hidden shadow-sm dark:shadow-none">
                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                <Zap size={64} />
                            </div>
                            <h3 className="text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase mb-2 tracking-wider flex items-center gap-2">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                Objective
                            </h3>
                            <p className="text-slate-700 dark:text-indigo-50 font-medium leading-relaxed text-lg">{levelData.instructions}</p>
                         </div>
                         
                         <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none">
                            <h4 className="text-slate-500 font-bold text-[10px] uppercase mb-3 flex items-center gap-1">
                                <CheckCircle size={12} /> Acceptance Criteria
                            </h4>
                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-500 mt-1">›</span> Write valid JavaScript
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-500 mt-1">›</span> Output must match exact solution
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-500 mt-1">›</span> Maintain syntax health {'>'} 0%
                                </li>
                            </ul>
                         </div>

                         {/* Hint Button */}
                         <button className="w-full mt-6 py-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-300 transition-all flex items-center justify-center gap-2">
                            <HelpCircle size={14} /> Need a Hint? (-5 XP)
                         </button>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="h-full flex flex-col">
                         
                         {/* Concept Simulation Engine */}
                         <ConceptSimulation levelTitle={levelData.title} />
                         
                         <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                            <h3 className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase mb-3 flex items-center gap-2">
                                <Globe size={12} /> Real World Context
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white dark:bg-slate-800/50 p-3 rounded border border-slate-200 dark:border-slate-700/50">
                                    <div className="text-slate-500 text-[9px] uppercase font-bold mb-1">Game Dev</div>
                                    <p className="text-slate-600 dark:text-slate-300 text-[10px]">
                                        {levelData.title.toLowerCase().includes('loop') ? 'Spawning infinite enemies' : 'Tracking player HP'}
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-slate-800/50 p-3 rounded border border-slate-200 dark:border-slate-700/50">
                                    <div className="text-slate-500 text-[9px] uppercase font-bold mb-1">Web Apps</div>
                                    <p className="text-slate-600 dark:text-slate-300 text-[10px]">
                                        {levelData.title.toLowerCase().includes('condition') ? 'Checking login passwords' : 'Saving user settings'}
                                    </p>
                                </div>
                            </div>
                         </div>
                    </motion.div>
                )}
            </div>
        </motion.section>

        {/* RIGHT PANEL: EDITOR */}
        <motion.section 
            animate={{ width: isSidebarCollapsed ? '100%' : '70%' }}
            className="flex flex-col bg-slate-100 dark:bg-slate-950 relative border-l border-slate-200 dark:border-slate-800 transition-colors duration-500"
        >
            {/* Toggle Sidebar Button */}
            <button 
                onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                className="absolute top-12 left-0 z-30 -ml-3 bg-white dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-600 text-slate-400 hover:text-indigo-600 dark:hover:text-white shadow-lg hidden md:block"
            >
                {isSidebarCollapsed ? <ChevronRight size={14} /> : <Minimize2 size={14} />}
            </button>

            <div className="flex-grow flex flex-col min-h-0 relative">
                 {/* Editor Toolbar */}
                 <div className="h-10 bg-slate-50 dark:bg-[#0f1422] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 select-none transition-colors duration-500">
                     <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/20 px-2 py-0.5 rounded">
                            <Terminal size={10} /> main.js
                        </span>
                        {isLoading && <span className="text-[10px] text-slate-500 animate-pulse">SAVING...</span>}
                     </div>
                     
                     <div className="flex items-center gap-4">
                         {/* Syntax Health Meter */}
                         <div className="flex items-center gap-2" title="Code Integrity">
                            <Activity size={12} className={syntaxHealth < 50 ? "text-red-500 animate-pulse" : "text-green-500"} />
                            <div className="w-20 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                <motion.div 
                                    className={`h-full ${syntaxHealth < 50 ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-green-500 shadow-[0_0_10px_lime]'}`}
                                    animate={{ width: `${syntaxHealth}%` }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                />
                            </div>
                         </div>

                         <div className="h-4 w-px bg-slate-300 dark:bg-slate-800" />

                         <button onClick={() => setCode(levelData.initialCode || '')} className="text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 dark:hover:text-white flex items-center gap-1 transition-colors">
                            <RotateCcw size={12} /> Reset
                         </button>
                     </div>
                 </div>
                 
                 {/* CODE EDITOR AREA */}
                 <motion.div 
                    className="flex-grow relative overflow-hidden"
                    animate={executionError ? { x: [-5, 5, -5, 5, 0] } : { x: 0 }}
                    transition={{ duration: 0.4 }}
                 >
                     <CodeEditor code={code} setCode={setCode} />
                     
                     {/* Warning Overlay */}
                     <AnimatePresence>
                        {lintWarning && (
                             <motion.div 
                                initial={{ y: 20, opacity: 0, scale: 0.95 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: 20, opacity: 0, scale: 0.95 }}
                                className="absolute bottom-4 left-4 right-20 z-20 bg-amber-50 dark:bg-amber-950/90 backdrop-blur-md border-l-4 border-amber-500 text-amber-800 dark:text-amber-200 px-4 py-3 rounded-r-lg text-sm flex items-start gap-3 shadow-2xl max-w-xl"
                             >
                                <div className="bg-amber-200 dark:bg-amber-500/20 p-1 rounded">
                                    <AlertCircle size={16} className="text-amber-600 dark:text-amber-500" />
                                </div>
                                <div>
                                    <span className="font-bold block text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-0.5">Syntax Warning</span>
                                    <span className="font-mono text-xs">{lintWarning}</span>
                                </div>
                             </motion.div>
                        )}
                     </AnimatePresence>
                 </motion.div>

                 {/* Floating Run Button */}
                 <div className="absolute bottom-6 right-8 z-30">
                     <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-20 rounded-full animate-pulse"></div>
                     <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={runCode}
                        disabled={isLoading}
                        className={`relative flex items-center gap-3 font-bold py-3 px-6 rounded-full shadow-xl transition-all border border-white/10 backdrop-blur-sm ${isLoading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/50'}`}
                     >
                        {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play fill="currentColor" size={18} />}
                        <span className="tracking-widest text-xs">{isLoading ? 'EXECUTING' : 'RUN CODE'}</span>
                     </motion.button>
                 </div>
            </div>

            {/* CONSOLE OUTPUT */}
            <div className="h-1/3 shrink-0 bg-slate-100 dark:bg-[#0a0a0a] border-t border-slate-200 dark:border-slate-800 flex flex-col relative shadow-inner z-20 transition-colors duration-500">
                <div className="px-4 py-1 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Terminal size={12} /> System Console
                    </span>
                    {output && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1.5 ${executionError ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20' : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'}`}>
                            {executionError ? <XCircle size={10} /> : <CheckCircle size={10} />}
                            {executionError ? 'FAILED' : 'SUCCESS'}
                        </span>
                    )}
                </div>
                
                <div className="p-4 font-mono text-sm overflow-y-auto custom-scrollbar flex-grow relative bg-white dark:bg-transparent">
                    {/* Placeholder */}
                    {!output && !isLoading && (
                        <div className="text-slate-400 dark:text-slate-700/50 italic flex flex-col items-center justify-center h-full gap-2">
                            <div className="w-8 h-8 border border-slate-300 dark:border-slate-800 rounded flex items-center justify-center">
                                <Terminal size={14} />
                            </div>
                            <span className="text-xs">Awaiting code execution...</span>
                        </div>
                    )}
                    
                    {/* Active Output */}
                    {output && (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            className={executionError ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}
                        >
                             <span className="text-slate-400 dark:text-slate-600 mr-2">$</span>
                             <TypewriterOutput text={output} />
                             {!executionError && !isLoading && <span className="inline-block w-2 h-4 bg-emerald-500/50 ml-1 animate-pulse align-middle" />}
                        </motion.div>
                    )}
                    <div ref={consoleEndRef} />
                </div>
            </div>
        </motion.section>
      </main>

      {/* STATUS FOOTER */}
      <footer className="h-6 bg-slate-50 dark:bg-[#050505] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 text-[10px] text-slate-500 dark:text-slate-600 font-mono z-30 select-none transition-colors duration-500">
         <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-500">
                <Wifi size={10} /> CONNECTED
            </span>
            <span>LATENCY: 24ms</span>
            <span className="hidden sm:inline">SERVER: US-EAST-1</span>
         </div>
         <div className="flex items-center gap-4">
            <span>Ln {code.split('\n').length}, Col 1</span>
            <span className="uppercase">UTF-8</span>
            <span className="text-indigo-500 font-bold">V2.4.0</span>
         </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  );
}