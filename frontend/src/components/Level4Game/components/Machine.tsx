import React from 'react';
import { motion } from 'framer-motion';
import { MachineState } from '../types.ts';
import { Zap, Cog, CheckCircle, AlertTriangle } from 'lucide-react';

interface MachineProps {
  name: string;
  state: MachineState;
}

const Machine: React.FC<MachineProps> = ({ name, state }) => {
  const isBroken = state === MachineState.BROKEN || state === MachineState.ERROR;
  const isFixing = state === MachineState.FIXING;
  const isFixed = state === MachineState.FIXED;

  return (
    <div className="relative w-full h-64 md:h-full flex items-center justify-center">
      {/* Background Glow */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isFixed ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/30 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Machine Icon Container */}
        <motion.div
          animate={
            isBroken ? { x: [-2, 2, -2], rotate: [0, 1, -1, 0] } :
            isFixing ? { rotate: 360 } :
            isFixed ? { scale: [1, 1.05, 1] } : {}
          }
          transition={
            isBroken ? { duration: 0.2, repeat: Infinity } :
            isFixing ? { duration: 1, repeat: Infinity, ease: "linear" } :
            isFixed ? { duration: 2, repeat: Infinity } : {}
          }
          className={`
            w-48 h-48 rounded-3xl border-4 flex items-center justify-center bg-slate-900/80 backdrop-blur
            ${isBroken ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : ''}
            ${isFixing ? 'border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.2)]' : ''}
            ${isFixed ? 'border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.4)]' : ''}
            transition-colors duration-500
          `}
        >
          {isBroken && <AlertTriangle size={64} className="text-red-500" />}
          {isFixing && <Cog size={64} className="text-yellow-500" />}
          {isFixed && <CheckCircle size={64} className="text-cyan-400" />}
        </motion.div>
        
        {/* Status Label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-center"
        >
          <h2 className="text-2xl font-bold text-slate-100 tracking-wider uppercase">{name}</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${
              isBroken ? 'bg-red-500 animate-pulse' :
              isFixing ? 'bg-yellow-500 animate-pulse' :
              'bg-cyan-500 shadow-[0_0_10px_cyan]'
            }`} />
            <span className={`text-sm font-mono uppercase tracking-widest ${
               isBroken ? 'text-red-400' :
               isFixing ? 'text-yellow-400' :
               'text-cyan-400'
            }`}>
              {state}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Particles / Sparks if broken */}
      {isBroken && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: "50%", y: "50%" }}
              animate={{ 
                opacity: [0, 1, 0],
                x: ["50%", `${50 + (Math.random() * 40 - 20)}%`],
                y: ["50%", `${50 + (Math.random() * 40 - 20)}%`]
              }}
              transition={{ duration: 0.5 + Math.random(), repeat: Infinity, delay: Math.random() }}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Machine;
