// src/pages/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion } from 'framer-motion';
import { 
  Terminal, Cpu, Trophy, ArrowRight, 
  Code2, Zap, Shield, ChevronRight, Activity 
} from 'lucide-react';

// --- VISUAL COMPONENTS ---

const BackgroundGrid = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {/* Dark Gradient Base */}
    <div className="absolute inset-0 bg-[#050505]" />
    
    {/* Grid Lines */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
    
    {/* Glowing Orbs */}
    <motion.div 
      animate={{ 
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{ duration: 8, repeat: Infinity }}
      className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" 
    />
    <motion.div 
      animate={{ 
        opacity: [0.2, 0.5, 0.2],
        scale: [1, 1.1, 1],
      }}
      transition={{ duration: 10, repeat: Infinity, delay: 1 }}
      className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px]" 
    />
  </div>
);

const FloatingIcon = ({ icon: Icon, delay, className }) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [-10, 10, -10] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
    className={`absolute text-slate-700/20 ${className}`}
  >
    <Icon size={48} />
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title, desc, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-4 rounded-xl flex flex-col items-center text-center group hover:border-slate-600 transition-colors"
  >
    <div className={`p-2 rounded-lg bg-slate-800 mb-3 group-hover:scale-110 transition-transform duration-300 ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
    <h3 className="text-white font-bold text-base mb-1">{title}</h3>
    <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
  </motion.div>
);

export default function Home() {
  const [user] = useAuthState(auth);

  return (
    <div className="relative h-screen w-full flex flex-col font-sans overflow-hidden text-slate-200 selection:bg-indigo-500/30">
      <BackgroundGrid />

      {/* Floating Decorative Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden max-w-7xl mx-auto z-0">
        <FloatingIcon icon={Code2} delay={0} className="top-20 left-10" />
        <FloatingIcon icon={Cpu} delay={2} className="bottom-40 right-10" />
        <FloatingIcon icon={Terminal} delay={1} className="top-32 right-20" />
      </div>

      {/* --- NAVBAR --- */}
      <header className="relative z-20 w-full px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
           <div className="bg-indigo-600 p-1.5 rounded">
             <Terminal size={18} className="text-white" />
           </div>
           <span className="font-bold text-lg tracking-wide">JAVA REALM</span>
        </div>
        <div className="flex items-center gap-4">
             {user ? (
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 rounded-full border border-slate-800">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-400">OPERATIVE_ACTIVE</span>
                 </div>
             ) : (
                 <Link to="/login" className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider">Login</Link>
             )}
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      {/* Used flex-grow to fill available space and justify-center to vertically align */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 w-full max-w-6xl mx-auto h-full">
        
        {/* HERO TEXT */}
        <div className="text-center w-full max-w-4xl mx-auto mb-8 lg:mb-12 relative">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
          >
            
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 leading-none">
              MASTER THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">
                SOURCE CODE
              </span>
            </h1>
            
            <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
              Initialize your journey into Java programming. Solve logic puzzles, 
              debug corrupted systems, and rise through the ranks.
            </p>
          </motion.div>

          {/* CTA BUTTON */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8"
          >
            <Link to="/map" className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] focus:outline-none ring-offset-2 focus:ring-2 ring-indigo-400">
                {/* Shine Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                <span className="relative flex items-center gap-2 text-sm uppercase tracking-wider">
                    {user ? 'Resume Simulation' : 'Initialize Protocol'} 
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
            </Link>
            <p className="mt-3 text-[10px] text-slate-600 font-mono uppercase">No prior data required • Free Access</p>
          </motion.div>
        </div>

        {/* FEATURE GRID */}
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl"
        >
            <FeatureCard 
                icon={Code2}
                title="Write Real Code"
                desc="Forget drag-and-drop. Type actual Java syntax to control the environment."
                color="bg-blue-500"
            />
            <FeatureCard 
                icon={Trophy}
                title="Earn Recognition"
                desc="Complete sectors to earn XP, unlock badges, and climb the leaderboard."
                color="bg-yellow-500"
            />
            <FeatureCard 
                icon={Shield}
                title="Boss Battles"
                desc="Test your knowledge in high-stakes simulation challenges."
                color="bg-rose-500"
            />
        </motion.div>

      </main>

      {/* --- FOOTER STATUS BAR --- */}
      <footer className="relative z-20 w-full bg-slate-950 border-t border-slate-900 py-2 px-6 shrink-0">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 max-w-7xl mx-auto">
              <div className="flex items-center gap-6">
                  <span className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      SERVER STATUS: ONLINE
                  </span>
                  <span className="hidden md:inline">REGION: SOUTH_AFRICA_1</span>
              </div>
              
              {/* Scrolling Ticker */}
              <div className="flex items-center gap-2">
                   <Activity size={12} />
                   <span className="uppercase tracking-widest">System Integrity: 100%</span>
              </div>
          </div>
      </footer>
    </div>
  );
}