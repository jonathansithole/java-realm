// src/components/MainLayout.jsx

import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot } from 'firebase/firestore'; 
import { auth, db, doSignOut } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { 
  Map, User, Trophy, LogOut, Terminal, 
  Sun, Moon, Cpu, Home // Added Home icon
} from 'lucide-react';

// --- THEME TOGGLE COMPONENT ---
const ThemeToggle = ({ theme, toggleTheme }) => (
    <button 
        onClick={toggleTheme}
        className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-300 dark:border-slate-700 shadow-sm"
        title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
        <AnimatePresence mode="wait">
            {theme === 'dark' ? (
                <motion.div 
                    key="moon" 
                    initial={{ rotate: -90, opacity: 0 }} 
                    animate={{ rotate: 0, opacity: 1 }} 
                    exit={{ rotate: 90, opacity: 0 }}
                >
                    <Moon size={18} />
                </motion.div>
            ) : (
                <motion.div 
                    key="sun" 
                    initial={{ rotate: 90, opacity: 0 }} 
                    animate={{ rotate: 0, opacity: 1 }} 
                    exit={{ rotate: -90, opacity: 0 }}
                >
                    <Sun size={18} />
                </motion.div>
            )}
        </AnimatePresence>
    </button>
);

// --- NAV ITEM COMPONENT (For Active/Inactive Routes) ---
const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink to={to} className={({ isActive }) => `
        group relative flex items-center gap-3 p-3 my-1.5 rounded-lg transition-all duration-300 font-medium text-sm overflow-hidden
        ${isActive 
            ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-r-2 border-indigo-500' 
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
        }
    `}>
        {({ isActive }) => (
            <>
                <Icon size={18} className={`relative z-10 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                <span className="relative z-10">{label}</span>
                {isActive && <div className="absolute inset-0 bg-indigo-500/5 dark:bg-indigo-500/20 z-0" />}
            </>
        )}
    </NavLink>
);

export default function MainLayout() {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // 1. Initialize Theme
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  // 2. Apply Theme Class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 3. Toggle Handler
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // 4. Fetch User Data (Real-time)
  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
    
    // Use onSnapshot for real-time updates
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
            setUserData(docSnapshot.data());
        }
    });

    return () => unsubscribe();
  }, [user]);

  const handleSignOut = async () => { await doSignOut(); navigate('/'); };

  if (loading || !user || !userData) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex items-center justify-center font-mono text-indigo-500 transition-colors duration-300">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        </div>
    );
  }

  // Safe Avatar Logic
  const avatarUrl = userData?.photoURL || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] flex font-sans text-slate-900 dark:text-slate-200 transition-colors duration-500">
      
      {/* --- SIDEBAR --- */}
      <aside className="fixed top-0 left-0 w-72 h-screen bg-white dark:bg-[#0f1422] border-r border-slate-200 dark:border-slate-800 flex flex-col z-50 shadow-xl dark:shadow-none transition-colors duration-500">
        
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
            <Link to="/map" className="flex items-center gap-2 group">
                <div className="bg-indigo-600 p-1.5 rounded-lg text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                    <Cpu size={20} />
                </div>
                <div>
                    <h1 className="font-bold text-lg tracking-tight text-slate-800 dark:text-white leading-none">JAVA<span className="text-indigo-600 dark:text-indigo-400">REALM</span></h1>
                </div>
            </Link>
            
            {/* TOGGLE BUTTON */}
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>

        {/* Navigation */}
        <nav className="flex-grow py-6 px-4">
            
            {/* EXIT BUTTON (Acts as a Link to Home) */}
            <Link 
                to="/" 
                className="group flex items-center gap-3 p-3 mb-4 rounded-lg font-medium text-sm text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
                title="Return to Landing Page (Keeps you logged in)"
            >
                <Home size={18} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                <span>Main Menu</span>
            </Link>

            <div className="h-px bg-slate-200 dark:bg-slate-800 mb-4 mx-2"></div>

            <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                Modules
            </div>
            
            <NavItem to="/map" icon={Map} label="World Map" />
            <NavItem to="/leaderboard" icon={Trophy} label="Leaderboard" />
            
            <div className="px-3 mb-2 mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                Personal
            </div>
            <NavItem to="/profile" icon={User} label="Profile" />
        </nav>

        {/* Player Profile (Bottom) */}
        <div className="mt-auto bg-slate-50 dark:bg-[#0a0d16] border-t border-slate-200 dark:border-slate-800 p-4 transition-colors duration-500">
            <div className="flex items-center gap-3 mb-4 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="relative">
                    <img 
                        src={avatarUrl} 
                        alt="Avatar" 
                        className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 object-cover" 
                    />
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                </div>
                <div className="overflow-hidden">
                    <h2 className="text-sm font-bold text-slate-800 dark:text-white truncate">{userData.displayName || "Unknown User"}</h2>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-indigo-400 font-mono">
                        <Terminal size={10} />
                        LVL {Math.floor(userData.currentLevel || 1)} • {userData.xp || 0} XP
                    </div>
                </div>
            </div>

            <button 
                onClick={handleSignOut} 
                className="group w-full flex items-center justify-center gap-2 p-2.5 text-xs font-bold text-slate-600 dark:text-rose-400 bg-white dark:bg-rose-500/10 border border-slate-200 dark:border-rose-500/20 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500 hover:text-rose-600 dark:hover:text-white hover:border-rose-200 dark:hover:border-rose-500 transition-all shadow-sm"
            >
                <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" /> 
                <span className="uppercase">Disconnect</span>
            </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="ml-72 w-full relative min-h-screen transition-all duration-300">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none z-0" />
         
         <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto">
             <Outlet />
         </div>
      </main>
    </div>
  );
}