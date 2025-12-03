// src/components/Quiz.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, HelpCircle, BrainCircuit, AlertCircle } from 'lucide-react';

export default function Quiz({ questions, onQuizComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (index) => {
    if (isAnswered) return;

    setSelectedAnswerIndex(index);
    setIsAnswered(true);

    if (index === currentQuestion.correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswerIndex(null);
      setIsAnswered(false);
    } else {
      onQuizComplete(score);
    }
  };

  // Progress Percentage
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-6 relative overflow-hidden transition-colors duration-500">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <BrainCircuit size={100} />
      </div>

      {/* --- HEADER & PROGRESS --- */}
      <div className="flex justify-between items-end mb-6">
        <div>
            <span className="text-[10px] font-mono text-indigo-500 dark:text-indigo-400 uppercase tracking-widest font-bold">
                Query Sequence
            </span>
            <div className="text-2xl font-black text-slate-800 dark:text-white">
                {String(currentQuestionIndex + 1).padStart(2, '0')} <span className="text-slate-400 dark:text-slate-600 text-lg">/ {String(questions.length).padStart(2, '0')}</span>
            </div>
        </div>
        <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div 
                className="h-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
            />
        </div>
      </div>

      {/* --- QUESTION AREA --- */}
      <AnimatePresence mode='wait'>
        <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 leading-relaxed">
                {currentQuestion.question}
            </h3>

            <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                    const isCorrect = index === currentQuestion.correctAnswerIndex;
                    const isSelected = index === selectedAnswerIndex;
                    
                    // Determine styles based on state
                    let styles = "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500";
                    let icon = <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />;

                    if (isAnswered) {
                        if (isCorrect) {
                            styles = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500";
                            icon = <CheckCircle size={20} className="text-emerald-500" />;
                        } else if (isSelected) {
                            styles = "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 opacity-80";
                            icon = <XCircle size={20} className="text-red-500" />;
                        } else {
                            styles = "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-600 opacity-50";
                        }
                    } else if (isSelected) {
                        styles = "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500";
                        icon = <div className="w-5 h-5 rounded-full border-4 border-indigo-500" />;
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={isAnswered}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 text-left ${styles}`}
                        >
                            <div className="shrink-0">{icon}</div>
                            <span>{option}</span>
                        </button>
                    );
                })}
            </div>
        </motion.div>
      </AnimatePresence>

      {/* --- FEEDBACK & NEXT --- */}
      <AnimatePresence>
        {isAnswered && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 overflow-hidden"
            >
                <div className={`p-4 rounded-lg flex gap-3 text-sm mb-4 ${selectedAnswerIndex === currentQuestion.correctAnswerIndex ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200' : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'}`}>
                    {selectedAnswerIndex === currentQuestion.correctAnswerIndex 
                        ? <CheckCircle size={20} className="shrink-0" />
                        : <AlertCircle size={20} className="shrink-0" />
                    }
                    <div>
                        <span className="font-bold block mb-1">
                            {selectedAnswerIndex === currentQuestion.correctAnswerIndex ? "Verification Successful" : "Incorrect Paramater"}
                        </span>
                        <span className="opacity-90">{currentQuestion.explanation || (selectedAnswerIndex !== currentQuestion.correctAnswerIndex && `Correct Answer: ${currentQuestion.options[currentQuestion.correctAnswerIndex]}`)}</span>
                    </div>
                </div>

                <button 
                    onClick={handleNext} 
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-xs"
                >
                    {currentQuestionIndex < questions.length - 1 ? 'Next Query' : 'Complete Verification'} <ArrowRight size={16} />
                </button>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}