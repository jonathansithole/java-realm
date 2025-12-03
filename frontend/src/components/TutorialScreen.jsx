// src/components/TutorialScreen.jsx

import React from 'react';
import CodeBlock from './CodeBlock'; // Assuming this component exists
import Quiz from './Quiz'; // Assuming this component exists
import { motion } from 'framer-motion';
import { 
  Target, Cpu, Zap, Terminal, Layers, 
  Lightbulb, ChevronRight, X, BookOpen 
} from 'lucide-react';

// --- SUB-COMPONENT: INFO SECTION ---
const BriefingSection = ({ icon: Icon, title, children, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="mb-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 overflow-hidden relative"
  >
    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
    <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-indigo-400 mb-3">
      <Icon size={16} /> {title}
    </h3>
    <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
      {children}
    </div>
  </motion.div>
);

export default function TutorialScreen({ tutorial, levelTitle, onComplete }) {
  
  // Loading State
  if (!tutorial) {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-indigo-500">
             <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
             <div className="text-xs font-mono animate-pulse uppercase tracking-widest">Loading Mission Data...</div>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0B0F19] transition-colors duration-500">
      
      {/* --- HEADER --- */}
      <div className="shrink-0 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#0f1422]/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
            <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
                <BookOpen size={20} />
            </div>
            <div>
                <h1 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">
                    Mission Briefing
                </h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    PROTOCOL: {levelTitle || "UNKNOWN"}
                </p>
            </div>
        </div>
        
        <button 
            onClick={onComplete}
            className="group flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
        >
            SKIP BRIEFING <X size={14} className="group-hover:rotate-90 transition-transform" />
        </button>
      </div>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="flex-grow overflow-y-auto p-6 md:p-8 custom-scrollbar relative">
        <div className="max-w-4xl mx-auto space-y-6">
            
            {/* 1. GOAL */}
            {tutorial.goal && (
                <BriefingSection icon={Target} title="Primary Objective" delay={0.1}>
                    {tutorial.goal}
                </BriefingSection>
            )}

            {/* 2. PREREQUISITES */}
            {tutorial.whatYouNeed && (
                <BriefingSection icon={Cpu} title="Required Tools" delay={0.2}>
                    {tutorial.whatYouNeed}
                </BriefingSection>
            )}

            {/* 3. CONCEPTS */}
            {tutorial.keyConcepts && (
                <BriefingSection icon={Zap} title="Core Concepts" delay={0.3}>
                    {tutorial.keyConcepts}
                </BriefingSection>
            )}

            {/* 4. CODE EXAMPLE */}
            {tutorial.codeExample && (
                <BriefingSection icon={Terminal} title="Syntax Reference" delay={0.4}>
                    <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                        <CodeBlock code={tutorial.codeExample} />
                    </div>
                </BriefingSection>
            )}

            {/* 5. BREAKDOWN */}
            {tutorial.breakdown && (
                <BriefingSection icon={Layers} title="Logic Analysis" delay={0.5}>
                    <ul className="space-y-3 mt-2">
                        {Object.entries(tutorial.breakdown).map(([key, value], idx) => (
                            <li key={key} className="flex items-start gap-3 text-sm">
                                <span className="shrink-0 flex items-center justify-center w-5 h-5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold font-mono border border-indigo-200 dark:border-indigo-500/30">
                                    {idx + 1}
                                </span>
                                <span>
                                    <strong className="text-slate-900 dark:text-white font-semibold block mb-0.5">{key}</strong>
                                    <span className="text-slate-600 dark:text-slate-400">{value}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </BriefingSection>
            )}

            {/* 6. EXTRA TIP */}
            {tutorial.extraTip && (
                <BriefingSection icon={Lightbulb} title="Tactical Advice" delay={0.6}>
                    <div className="flex gap-3 bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-200 dark:border-yellow-500/20 text-yellow-800 dark:text-yellow-200/80">
                        <Lightbulb size={18} className="shrink-0 mt-0.5" />
                        <p>{tutorial.extraTip}</p>
                    </div>
                </BriefingSection>
            )}

            {/* 7. QUIZ or CONTINUE */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="pt-6 border-t border-slate-200 dark:border-slate-800"
            >
                {tutorial.quiz && tutorial.quiz.length > 0 ? (
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="w-2 h-6 bg-emerald-500 rounded-full"/> 
                            Knowledge Verification
                        </h2>
                        {/* 
                           Passing props to Quiz. Ensure Quiz.jsx is updated to handle styles 
                           or accepts className props if it has hardcoded styles. 
                        */}
                        <Quiz questions={tutorial.quiz} onQuizComplete={onComplete} />
                    </div>
                ) : (
                    <div className="flex justify-center pb-8">
                        <button 
                            onClick={onComplete} 
                            className="group relative flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-12 rounded-xl shadow-xl shadow-indigo-500/20 transition-all transform hover:scale-105"
                        >
                            <span className="uppercase tracking-widest text-sm">Initialize Challenge</span>
                            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                            
                            {/* Glow Effect */}
                            <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
                        </button>
                    </div>
                )}
            </motion.div>

        </div>
      </div>
    </div>
  );
}