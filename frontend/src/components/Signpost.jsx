// src/components/Signpost.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Navigation, Map, ArrowRight, CheckCircle, Radio } from 'lucide-react';

export default function Signpost({ levelData, onContinue }) {
  if (!levelData) return null;

  return (
    <div className="w-full h-full flex items-center justify-center p-6 relative overflow-hidden">
        
        {/* Background Grid for context */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none" />

        <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="relative max-w-lg w-full bg-[#0f1422]/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden"
        >
            {/* Top Status Bar */}
            <div className="h-8 bg-cyan-950/30 border-b border-cyan-500/20 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Radio size={14} className="text-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest">Signal: Stabilized</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500">NAV-SYS-V2</div>
            </div>

            <div className="p-10 flex flex-col items-center text-center">
                
                {/* Main Visual */}
                <div className="relative mb-8">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border border-dashed border-cyan-500/30"
                    />
                    <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.2)] relative z-10">
                        <Navigation size={48} className="text-cyan-400 fill-cyan-400/20" />
                    </div>
                </div>

                {/* Text Content */}
                <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-200">
                    Vector Confirmed
                </h1>
                
                <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-8 font-mono">
                    Encryption bypassed.<br/>
                    Pathfinding algorithms updated.<br/>
                    The route forward is now visible to all operatives.
                </p>

                {/* Action Button */}
                <button 
                    onClick={onContinue} 
                    className="group relative w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-cyan-900/20"
                >
                    <span className="uppercase tracking-widest text-sm">Resume Trajectory</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    
                    {/* Inner Shine */}
                    <div className="absolute inset-0 rounded-xl ring-1 ring-white/20 group-hover:ring-white/40 transition-all" />
                </button>
            </div>

            {/* Decorative Corner Lines */}
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-500/30 rounded-br-2xl" />
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-2xl" />

        </motion.div>
    </div>
  );
}