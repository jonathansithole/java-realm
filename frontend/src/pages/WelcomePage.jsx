// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Cpu, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- VISUAL ASSETS ---
const BackgroundGrid = () => (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:60px_60px]" />
        
        {/* Animated Glows */}
        <motion.div 
            animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" 
        />
        <motion.div 
            animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
            transition={{ duration: 12, repeat: Infinity, delay: 2 }}
            className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[100px]" 
        />
    </div>
);

export default function LoginPage() {
  const [activeForm, setActiveForm] = useState('login'); // 'login' or 'signup'

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 font-sans relative overflow-hidden text-slate-200">
      <BackgroundGrid />

      {/* Back to Home Link */}
      <Link to="/" className="absolute top-6 left-6 z-20 flex items-center gap-2 text-slate-500 hover:text-white transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-mono uppercase tracking-widest">Abort Sequence</span>
      </Link>

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* --- LEFT SIDE: BRANDING --- */}
        <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:flex flex-col justify-center space-y-8"
        >
            <div className="inline-flex items-center gap-3 bg-slate-900/50 border border-slate-800 rounded-full px-4 py-2 w-fit backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-mono text-emerald-400 tracking-widest">SECURE CONNECTION ESTABLISHED</span>
            </div>

            <div>
                <h1 className="text-5xl font-black text-white leading-tight mb-4 tracking-tight">
                    ACCESS THE <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">JAVA REALM</span>
                </h1>
                <p className="text-lg text-slate-400 leading-relaxed max-w-md">
                    Initialize your operative profile to begin simulation training. Master syntax, logic, and algorithms in a gamified environment.
                </p>
            </div>

            {/* Feature Icons */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><Terminal size={24} /></div>
                    <div>
                        <div className="font-bold text-white text-sm">Real Syntax</div>
                        <div className="text-xs text-slate-500">No blocks, just code.</div>
                    </div>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400"><Shield size={24} /></div>
                    <div>
                        <div className="font-bold text-white text-sm">Ranked System</div>
                        <div className="text-xs text-slate-500">Compete globally.</div>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* --- RIGHT SIDE: AUTH FORM --- */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#0f1422]/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative"
        >
            {/* Top Bar Decoration */}
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
            
            <div className="p-8 md:p-10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        {activeForm === 'login' ? <Lock className="text-indigo-500" /> : <Cpu className="text-emerald-500" />}
                        {activeForm === 'login' ? 'System Login' : 'New Operative'}
                    </h2>
                    
                    {/* Toggle Switch */}
                    <div className="bg-slate-900 p-1 rounded-lg flex text-xs font-bold border border-slate-800">
                        <button
                            onClick={() => setActiveForm('login')}
                            className={`px-3 py-1.5 rounded-md transition-all ${activeForm === 'login' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            LOGIN
                        </button>
                        <button
                            onClick={() => setActiveForm('signup')}
                            className={`px-3 py-1.5 rounded-md transition-all ${activeForm === 'signup' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            REGISTER
                        </button>
                    </div>
                </div>

                {/* Form Container with AnimatePresence for smooth transitions */}
                <div className="relative min-h-[320px]">
                    <AnimatePresence mode='wait'>
                        {activeForm === 'login' ? (
                            <motion.div 
                                key="login"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <LoginForm />
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-slate-500">
                                        Don't have an ID?{' '}
                                        <button onClick={() => setActiveForm('signup')} className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                                            Initialize Protocol
                                        </button>
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="signup"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <SignupForm />
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-slate-500">
                                        Already registered?{' '}
                                        <button onClick={() => setActiveForm('login')} className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
                                            Access System
                                        </button>
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            
            {/* Bottom Status Bar */}
            <div className="bg-slate-950/50 py-3 px-6 border-t border-slate-800 flex justify-between text-[10px] text-slate-600 font-mono uppercase">
                <span>Encyrption: AES-256</span>
                <span>Server: ZA-West-1</span>
            </div>
        </motion.div>
      </div>
    </div>
  );
}