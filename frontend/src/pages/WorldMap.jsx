// src/pages/WorldMap.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getBossGameComponent } from '../games/GameMapper';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, CheckCircle, Play, Map as MapIcon, 
  Gamepad2, Zap, Trophy, Terminal, Cpu, X, 
  Info, ChevronRight, ShieldAlert, Binary, HelpCircle // Added HelpCircle
} from 'lucide-react';

// --- COMPONENT: BOOT SEQUENCE ---
const BootSequence = ({ onComplete }) => {
    const [text, setText] = useState('');
    const fullText = "Loading...";
    
    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setText(fullText.slice(0, i));
            i++;
            if (i > fullText.length) {
                clearInterval(interval);
                setTimeout(onComplete, 800);
            }
        }, 30);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-slate-50 dark:bg-black z-[100] flex flex-col items-center justify-center font-mono text-indigo-600 dark:text-green-500 transition-colors duration-500">
            <div className="w-64 mb-4">
                 <div className="h-1 bg-slate-200 dark:bg-green-900 rounded overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: "100%" }} 
                        transition={{ duration: 2.5, ease: "linear" }}
                        className="h-full bg-indigo-600 dark:bg-green-500" 
                    />
                 </div>
            </div>
            <div className="text-xs tracking-widest">{text}<span className="animate-pulse">_</span></div>
        </div>
    );
};

// --- COMPONENT: ONBOARDING TUTORIAL ---
const OnboardingModal = ({ onClose }) => {
    const [step, setStep] = useState(0);
    const steps = [
        {
            title: "Welcome, Operative",
            desc: "You have entered the Java Realm. This system is designed to test your coding capabilities.",
            icon: <Terminal size={48} className="text-indigo-600 dark:text-indigo-400" />
        },
        {
            title: "Select Your Mission",
            desc: "Navigate through Sectors (Worlds). Click on a Level Card to begin your coding simulation.",
            icon: <MapIcon size={48} className="text-emerald-600 dark:text-emerald-400" />
        },
        {
            title: "Gather Intelligence",
            desc: "Click the 'i' icon on any level to view specific concepts and difficulty ratings before starting.",
            icon: <Info size={48} className="text-blue-600 dark:text-blue-400" />
        },
        {
            title: "Defeat The Boss",
            desc: "Complete all levels in a sector to unlock the BOSS CHALLENGE. Win to earn badges and massive XP.",
            icon: <ShieldAlert size={48} className="text-rose-600 dark:text-rose-500" />
        }
    ];

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-500 p-8 rounded-2xl max-w-md w-full relative overflow-hidden shadow-2xl"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                        {steps[step].icon}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{steps[step].title}</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{steps[step].desc}</p>
                    </div>
                    
                    <div className="flex items-center justify-between w-full pt-4">
                        <div className="flex gap-1">
                            {steps.map((_, i) => (
                                <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i === step ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                            ))}
                        </div>
                        <button 
                            onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : onClose()}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/30"
                        >
                            {step < steps.length - 1 ? "Next" : "Initialize"} <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// --- COMPONENT: LEVEL INTEL MODAL ---
const LevelIntelModal = ({ level, onClose, isLocked }) => {
    if (!level) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/20 dark:bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-white dark:bg-[#0f1422] border border-slate-200 dark:border-slate-700 rounded-xl max-w-lg w-full p-6 relative shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Mission Intel</div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{level.title}</h2>
                    </div>
                    <button onClick={onClose} className="p-1 bg-slate-100 dark:bg-slate-800 rounded hover:text-indigo-500 text-slate-400"><X size={20}/></button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800">
                        <div className="text-slate-500 text-xs mb-1">XP Reward</div>
                        <div className="text-xl font-bold text-yellow-500 dark:text-yellow-400 flex items-center gap-2">
                            <Zap size={18} /> {level.xpReward}
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800">
                        <div className="text-slate-500 text-xs mb-1">Difficulty</div>
                        <div className="flex gap-1 mt-1.5">
                            {[1,2,3,4,5].map(i => (
                                <div key={i} className={`h-2 w-full rounded-sm ${i <= (level.difficulty || 1) ? 'bg-red-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-sm font-bold text-indigo-500 dark:text-indigo-400 uppercase mb-2">Core Concepts</h3>
                    <div className="flex flex-wrap gap-2">
                        {level.concepts ? level.concepts.map((c, i) => (
                            <span key={i} className="text-xs bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 px-2 py-1 rounded">
                                {c}
                            </span>
                        )) : <span className="text-xs text-slate-500">Classified Data</span>}
                    </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm">
                    {level.description || "No mission briefing available for this sector."}
                </div>

                {isLocked && (
                     <div className="mt-4 flex items-center justify-center gap-2 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-2 rounded border border-red-200 dark:border-red-900/30">
                        <Lock size={14} /> <span>Complete previous levels to unlock</span>
                     </div>
                )}
            </motion.div>
        </div>
    );
};

// --- HELPERS ---
const ProgressBar = ({ current, total }) => {
    const percent = Math.min(100, Math.round((current / total) * 100));
    return (
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-900 rounded-sm overflow-hidden mt-4 border border-slate-300 dark:border-slate-800 relative group">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                className={`h-full relative ${percent === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
            >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </motion.div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
export default function WorldMap() {
  const [user] = useAuthState(auth);
  const [worlds, setWorlds] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bootComplete, setBootComplete] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Game & Modal States
  const [isGameOpen, setIsGameOpen] = useState(false); 
  const [gameMessage, setGameMessage] = useState('');
  const [currentGameData, setCurrentGameData] = useState(null);
  const [selectedLevelInfo, setSelectedLevelInfo] = useState(null);

  useEffect(() => {
    // Check local storage for tutorial
    const hasSeenTutorial = localStorage.getItem('hasSeenMapTutorial');
    if (!hasSeenTutorial) {
        setShowTutorial(true);
    }

    const fetchGameData = async () => {
      if (!user) return;
      
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      setUserProgress(userDoc.exists() ? userDoc.data() : { currentLevel: 1.1 });

      const worldsCollectionRef = collection(db, 'worlds');
      const worldsSnapshot = await getDocs(worldsCollectionRef);
      const worldsData = await Promise.all(
        worldsSnapshot.docs.map(async (worldDoc) => {
          const levelsCollectionRef = collection(worldDoc.ref, 'levels');
          const levelsSnapshot = await getDocs(levelsCollectionRef);
          const levelsData = levelsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
          return { id: worldDoc.id, ...worldDoc.data(), levels: levelsData };
        })
      );
      setWorlds(worldsData.sort((a,b) => parseInt(a.id) - parseInt(b.id)));
      setIsLoading(false);
    };
    fetchGameData();
  }, [user]);

  const closeTutorial = () => {
      setShowTutorial(false);
      localStorage.setItem('hasSeenMapTutorial', 'true');
  };

  const handleStartBossLevel = (worldId, worldTitle, levels) => {
      const bossLevel = levels.slice(-1)[0]; 
      if (!bossLevel) {
          setGameMessage('System Error: Boss level data corrupted.');
          return;
      }
      const GameComponent = getBossGameComponent(worldId);
      setCurrentGameData({
          worldId,
          worldTitle,
          levelData: bossLevel,
          GameComponent: GameComponent
      });
      setIsGameOpen(true);
  };

  const handleGameComplete = async (finalScore) => {
    const xpReward = Math.floor(finalScore / 10); 
    setGameMessage(`SIMULATION COMPLETE. SCORE: ${finalScore} | REWARD: +${xpReward} XP`);
    if (user) {
        try {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, { 
                totalXP: (userProgress?.totalXP || 0) + xpReward,
                gamesPlayed: (userProgress?.gamesPlayed || 0) + 1,
            });
            setUserProgress(prev => ({
                ...prev,
                totalXP: (prev.totalXP || 0) + xpReward
            }));
        } catch (error) {
            console.error("Error updating user progress:", error);
        }
    }
  };

  // --- RENDER LOGIC ---
  if (!bootComplete) {
      return <BootSequence onComplete={() => setBootComplete(true)} />;
  }

  if (isLoading || !userProgress) {
    return <div className="min-h-screen bg-slate-50 dark:bg-black" />;
  }

  const currentLevelFloat = parseFloat(userProgress.currentLevel || 1.1);

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-slate-200 font-sans relative overflow-x-hidden selection:bg-indigo-500/30 transition-colors duration-500">
      
      {/* Tutorial Overlay */}
      <AnimatePresence>
        {showTutorial && <OnboardingModal onClose={closeTutorial} />}
      </AnimatePresence>

      {/* Level Info Modal */}
      <AnimatePresence>
        {selectedLevelInfo && (
            <LevelIntelModal 
                level={selectedLevelInfo.data} 
                isLocked={selectedLevelInfo.isLocked}
                onClose={() => setSelectedLevelInfo(null)} 
            />
        )}
      </AnimatePresence>

      {/* --- HUD HEADER --- */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#050505]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-2xl transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                  <div className="bg-indigo-600 p-2 rounded relative overflow-hidden group shadow-lg shadow-indigo-500/30">
                     <div className="absolute inset-0 bg-white/30 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"/>
                    <Binary size={24} className="text-white" />
                  </div>
                  <div>
                    <h1 className="font-black text-xl text-slate-800 dark:text-white tracking-widest uppercase flex items-center gap-2">
                        Java Realm 
                    </h1>
                    
                  </div>
              </div>

              <div className="flex items-center gap-6">
                  
                  {/* --- NEW TUTORIAL BUTTON --- */}
                  <button 
                    onClick={() => setShowTutorial(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-all text-xs font-bold uppercase tracking-wider"
                    title="Replay System Tutorial"
                  >
                    <HelpCircle size={16} />
                    <span className="hidden md:inline">System Guide</span>
                  </button>

                  <div className="hidden md:flex flex-col items-end">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Operative XP</span>
                      <div className="flex items-center gap-2">
                          <span className="text-xl font-black text-slate-800 dark:text-white font-mono">{userProgress.totalXP || 0}</span>
                      </div>
                  </div>
                  <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
                  <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner">
                      <Trophy size={20} className="text-yellow-500" />
                  </div>
              </div>
          </div>
      </header>
       
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* NOTIFICATIONS */}
        <AnimatePresence>
            {gameMessage && (
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="fixed top-24 right-6 z-50 bg-white dark:bg-slate-900 border-l-4 border-emerald-500 text-slate-800 dark:text-emerald-100 p-4 rounded shadow-2xl backdrop-blur max-w-sm border border-slate-200 dark:border-slate-800"
                >
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-500">System Alert</span>
                        <button onClick={() => setGameMessage('')}><X size={14}/></button>
                    </div>
                    <p className="text-sm font-mono">{gameMessage}</p>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="space-y-20">
            {worlds.map((world, index) => {
                const worldLevels = world.levels.length;
                const completedInWorld = world.levels.filter(l => parseFloat(l.id) < currentLevelFloat).length;
                const isWorldUnlocked = index === 0 || parseFloat(worlds[index-1].levels[worlds[index-1].levels.length-1].id) < currentLevelFloat;

                return (
                    <motion.div 
                        key={world.id} 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className={`relative ${!isWorldUnlocked ? 'opacity-50 grayscale' : ''}`}
                    >
                        {/* Sector Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-xs font-black px-2 py-1 rounded bg-indigo-600 text-white uppercase tracking-widest shadow-lg shadow-indigo-500/30">
                                        Sector 0{world.id}
                                    </span>
                                    {!isWorldUnlocked && <span className="flex items-center gap-1 text-xs text-red-500 font-mono"><Lock size={12}/> LOCKED</span>}
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-slate-500 uppercase tracking-tighter">
                                    {world.title}
                                </h2>
                            </div>
                            <div className="w-full md:w-64">
                                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 mb-2">
                                    <span>Sync Status</span>
                                    <span>{Math.round((completedInWorld/worldLevels)*100)}%</span>
                                </div>
                                <ProgressBar current={completedInWorld} total={worldLevels} />
                            </div>
                        </div>

                        {/* Level Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {world.levels.map(level => {
                                const levelFloat = parseFloat(level.id);
                                const isCompleted = levelFloat < currentLevelFloat;
                                const isCurrent = levelFloat === currentLevelFloat;
                                const isLocked = levelFloat > currentLevelFloat; 

                                return (
                                    <div key={level.id} className="relative group">
                                        <div className={`
                                            relative h-full p-1 rounded-xl transition-all duration-300 shadow-sm hover:shadow-xl
                                            ${isCurrent ? 'bg-gradient-to-b from-indigo-500 via-purple-500 to-indigo-500 p-[2px]' : 'bg-white dark:bg-slate-800'}
                                            ${isLocked ? 'opacity-70' : 'hover:-translate-y-1'}
                                        `}>
                                            <div className="bg-white dark:bg-[#0a0a0a] rounded-xl h-full p-5 flex flex-col justify-between relative overflow-hidden border border-slate-100 dark:border-transparent">
                                                
                                                {/* Card Header */}
                                                <div className="flex justify-between items-start mb-4 z-10">
                                                    <div className={`p-2 rounded-lg ${isCompleted ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : isCurrent ? 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-600'}`}>
                                                        {isLocked ? <Lock size={20} /> : isCompleted ? <CheckCircle size={20} /> : <Play size={20} fill="currentColor" />}
                                                    </div>
                                                    
                                                    {/* INFO BUTTON */}
                                                    <button 
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setSelectedLevelInfo({ data: level, isLocked });
                                                        }}
                                                        className="text-slate-400 hover:text-indigo-600 dark:hover:text-blue-400 transition-colors"
                                                    >
                                                        <Info size={18} />
                                                    </button>
                                                </div>

                                                {/* Card Content */}
                                                <div className="z-10">
                                                    <span className="text-[10px] font-mono text-slate-400 uppercase">Mission {level.id}</span>
                                                    <h3 className={`font-bold text-lg leading-tight mb-2 ${isLocked ? 'text-slate-400 dark:text-slate-600' : 'text-slate-800 dark:text-slate-200'}`}>
                                                        {level.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-3">
                                                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isLocked ? 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-700' : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500'}`}>
                                                            {level.xpReward} XP
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Decoration */}
                                                {isCurrent && <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-indigo-500/20 blur-2xl rounded-full" />}
                                                
                                                {/* Click Target */}
                                                {!isLocked && (
                                                    <Link to={`/level/${world.id}/${level.id}`} className="absolute inset-0 z-0" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* BOSS NODE */}
                            <motion.button 
                                whileHover={!isWorldUnlocked ? {} : { scale: 1.02 }}
                                whileTap={!isWorldUnlocked ? {} : { scale: 0.98 }}
                                onClick={() => isWorldUnlocked && handleStartBossLevel(world.id, world.title, world.levels)} 
                                className={`
                                    relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center p-6 gap-3 transition-all group overflow-hidden shadow-sm
                                    ${!isWorldUnlocked 
                                        ? 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 cursor-not-allowed opacity-50'
                                        : 'border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-950/10 hover:bg-rose-100 dark:hover:bg-rose-950/30 hover:border-rose-400 dark:hover:border-rose-500 hover:shadow-lg'
                                    }
                                `}
                            >
                                <div className={`p-4 rounded-full transition-colors ${!isWorldUnlocked ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 group-hover:scale-110 duration-300'}`}>
                                    <Gamepad2 size={28} />
                                </div>
                                <div className="relative z-10">
                                    <div className={`text-sm font-black uppercase tracking-widest ${!isWorldUnlocked ? 'text-slate-400 dark:text-slate-600' : 'text-rose-600 dark:text-rose-400 group-hover:text-rose-700 dark:group-hover:text-rose-300'}`}>
                                        Boss Battle
                                    </div>
                                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Sector Final Assessment</div>
                                </div>
                            </motion.button>
                        </div>
                    </motion.div>
                );
            })}
        </div>
      </main>

      {/* --- GAME MODAL --- */}
      <AnimatePresence>
        {isGameOpen && currentGameData && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/80 dark:bg-black/90 backdrop-blur-md"
                    onClick={() => setIsGameOpen(false)}
                />
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative w-full max-w-6xl h-full md:h-[90vh] bg-slate-50 dark:bg-[#050505] md:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col"
                >
                    <div className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Simulation // {currentGameData.worldTitle}</span>
                        </div>
                        <button onClick={() => setIsGameOpen(false)} className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="flex-grow relative bg-slate-100 dark:bg-black">
                        <currentGameData.GameComponent 
                            userId={user.uid}
                            worldId={currentGameData.worldId}
                            levelData={currentGameData.levelData} 
                            onGameOver={handleGameComplete} 
                            onClose={() => setIsGameOpen(false)}
                        />
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}