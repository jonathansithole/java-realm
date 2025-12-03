// src/components/TutorialModal.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ChevronRight, X, Zap, Terminal } from 'lucide-react';

// --- INTERNAL COMPONENT: TYPEWRITER TEXT ---
const TypewriterText = ({ text }) => {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const speed = 20; // ms per char
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text]);

  return <span>{displayed}<span className="animate-pulse ml-1 inline-block w-2 h-4 bg-indigo-500 align-middle"/></span>;
};

export default function TutorialModal({ messages, onComplete }) {
  const [step, setStep] = useState(0);

  // Safety check
  if (!messages || messages.length === 0) {
    onComplete();
    return null;
  }

  const handleNext = () => {
    if (step < messages.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm font-sans">
      
      {/* Modal Container */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl bg-[#0f1422] border border-indigo-500/50 rounded-xl shadow-2xl overflow-hidden relative"
      >
        {/* Decorative Scanline */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,255,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] opacity-20" />

        {/* --- HEADER BAR --- */}
        <div className="relative z-10 h-10 bg-slate-900 border-b border-indigo-500/30 flex items-center justify-between px-4 select-none">
            <div className="flex items-center gap-2 text-indigo-400">
                <Terminal size={14} />
                <span className="text-xs font-mono font-bold tracking-widest uppercase">System_Guide.exe</span>
            </div>
            <button 
                onClick={onComplete}
                className="text-slate-500 hover:text-white transition-colors flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider"
            >
                Skip Protocol <X size={14} />
            </button>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="relative z-10 p-8 flex flex-col items-center text-center">
            
            {/* AI Avatar */}
            <div className="relative mb-6">
                <div className="w-20 h-20 bg-indigo-900/30 rounded-full flex items-center justify-center border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    <Bot size={40} className="text-indigo-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-slate-900 border border-indigo-500/50 rounded-full p-1">
                    <Zap size={12} className="text-yellow-400 fill-yellow-400" />
                </div>
                {/* Ping Animation */}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </span>
            </div>

            {/* Dynamic Text Area */}
            <div className="min-h-[120px] flex items-center justify-center mb-8 w-full">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-lg md:text-xl text-slate-200 font-medium leading-relaxed max-w-lg"
                    >
                       <TypewriterText text={messages[step]} />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="w-full flex items-center justify-between border-t border-slate-800 pt-6">
                
                {/* Progress Indicators */}
                <div className="flex gap-1.5">
                    {messages.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                index === step ? 'w-8 bg-indigo-500 shadow-[0_0_8px_indigo]' : 'w-2 bg-slate-700'
                            }`}
                        />
                    ))}
                </div>

                {/* Action Button */}
                <button
                    onClick={handleNext}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-indigo-900/40 group"
                >
                    {step < messages.length - 1 ? 'Proceed' : 'Initialize'}
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

        </div>
      </motion.div>
    </div>
  );
}