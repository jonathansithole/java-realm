// src/components/SuccessScreen.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, ArrowRight, CheckCircle, Award, Terminal } from 'lucide-react';

export default function SuccessScreen({ levelData, onContinue }) {
  // Guard clause
  if (!levelData || !levelData.badge) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md font-sans text-slate-200">
      
      {/* Main Modal Container */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="relative w-full max-w-lg bg-[#0f1422] border border-emerald-500/50 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.2)] overflow-hidden"
      >
        {/* Decorative Top Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500" />

        <div className="p-8 flex flex-col items-center text-center relative z-10">
            
            {/* Success Icon */}
            <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border-2 border-emerald-500 mb-6 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
                <CheckCircle size={48} className="text-emerald-400" />
            </motion.div>

            {/* Headers */}
            <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-black text-white uppercase tracking-wider mb-2"
            >
                Mission Accomplished
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-slate-400 text-sm font-mono mb-8"
            >
                System logic verified. Data integrity: 100%.
            </motion.p>

            {/* Rewards Grid */}
            <div className="grid grid-cols-2 gap-4 w-full mb-8">
                {/* XP Reward */}
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center gap-2 group hover:border-yellow-500/50 transition-colors"
                >
                    <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500 mb-1">
                        <Zap size={24} />
                    </div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Experience</div>
                    <div className="text-2xl font-black text-yellow-400">+{levelData.xpReward} XP</div>
                </motion.div>

                {/* Badge Reward */}
                <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center gap-2 group hover:border-indigo-500/50 transition-colors"
                >
                    <div className="text-3xl filter drop-shadow-md animate-bounce">
                        {levelData.badge.icon}
                    </div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Acquired</div>
                    <div className="text-sm font-bold text-white truncate max-w-full px-2">
                        {levelData.badge.name}
                    </div>
                </motion.div>
            </div>

            {/* Continue Button */}
            <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                onClick={onContinue}
                className="w-full group relative flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/40 transition-all transform hover:scale-[1.02]"
            >
                <span className="uppercase tracking-widest text-sm">Proceed to Next Sector</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                
                {/* Button Shine Effect */}
                <div className="absolute inset-0 rounded-xl ring-2 ring-white/10 group-hover:ring-white/30 transition-all" />
            </motion.button>

        </div>

        {/* Background Grid Pattern inside Modal */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
      </motion.div>
    </div>
  );
}