import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

interface Mek4Props {
  message: string;
  mood: 'happy' | 'waiting' | 'worried' | 'celebrating';
  className?: string;
}

const Mek4: React.FC<Mek4Props> = ({ message, mood, className = "" }) => {
  const colors = {
    happy: 'text-cyan-400 border-cyan-400/50',
    waiting: 'text-yellow-400 border-yellow-400/50',
    worried: 'text-red-400 border-red-400/50',
    celebrating: 'text-green-400 border-green-400/50'
  };

  const bgColors = {
     happy: 'shadow-cyan-500/20',
     waiting: 'shadow-yellow-500/20',
     worried: 'shadow-red-500/20',
     celebrating: 'shadow-green-500/20'
  }

  const iconColor = colors[mood];

  return (
    <div className={`flex flex-row items-end gap-4 ${className}`}>
      {/* Dialogue Bubble */}
      <motion.div
        key={message}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="flex-1 relative bg-slate-800/90 backdrop-blur border border-slate-700 p-4 rounded-2xl rounded-bl-none text-slate-200 shadow-lg min-h-[80px] flex items-center"
      >
        <p className="text-sm font-medium font-mono leading-relaxed">
          {message}
        </p>
        {/* Speech arrow */}
        <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 bg-slate-800/90 border-b border-l border-slate-700 transform translate-y-1/2 rotate-45 -z-10 rounded-bl" />
      </motion.div>

      {/* Robot Body */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`relative w-16 h-16 md:w-20 md:h-20 bg-slate-900 border-2 rounded-full flex items-center justify-center shadow-xl flex-shrink-0 ${iconColor} ${bgColors[mood]}`}
      >
        <Bot size={32} className="md:w-10 md:h-10" strokeWidth={1.5} />
        {/* Eyes animation */}
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute inset-1 rounded-full border ${mood === 'celebrating' ? 'border-green-400/30' : 'border-transparent'}`}
        />
      </motion.div>
    </div>
  );
};

export default Mek4;