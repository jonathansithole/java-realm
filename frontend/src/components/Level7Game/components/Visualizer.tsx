import React from 'react';
import { Activity, Zap, ShieldCheck, AlertTriangle } from 'lucide-react';
import { MachineStatus } from '../types.ts';

interface VisualizerProps {
    status: MachineStatus;
    levelType: string;
}

export const Visualizer: React.FC<VisualizerProps> = ({ status, levelType }) => {
    
    const isError = status === MachineStatus.ERROR;
    const isSuccess = status === MachineStatus.STABILIZED;
    const isRunning = status === MachineStatus.RUNNING;

    return (
        <div className="relative w-full h-64 bg-black/40 rounded-xl border border-slate-600/50 backdrop-blur-sm flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            
            {/* Background Grid Animation */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* Central Machine Core */}
            <div className={`relative z-10 transition-all duration-500 ${isError ? 'shake' : ''}`}>
                <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center bg-slate-800/90 shadow-2xl
                    ${isError ? 'border-red-500 shadow-red-500/50' : ''}
                    ${isSuccess ? 'border-green-400 shadow-green-400/50' : ''}
                    ${status === MachineStatus.IDLE ? 'border-slate-500' : ''}
                    ${isRunning ? 'border-yellow-400 animate-pulse' : ''}
                `}>
                    {isError && <AlertTriangle className="w-16 h-16 text-red-500 animate-bounce" />}
                    {isSuccess && <ShieldCheck className="w-16 h-16 text-green-400" />}
                    {isRunning && <Activity className="w-16 h-16 text-yellow-400 animate-spin" />}
                    {status === MachineStatus.IDLE && <Zap className="w-16 h-16 text-slate-600" />}
                </div>

                {/* Rotating Rings */}
                <div className={`absolute inset-0 -m-4 border-2 border-dashed rounded-full w-40 h-40
                    ${isSuccess ? 'border-green-500/30 animate-[spin_10s_linear_infinite]' : 'border-slate-700'}
                    ${isError ? 'border-red-500/50' : ''}
                `}></div>
            </div>

            {/* Sparks Effect (Simple CSS based) */}
            {isError && (
                <>
                    <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                    <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-red-500 rounded-full animate-ping delay-75"></div>
                    <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-orange-400 rounded-full animate-ping delay-150"></div>
                </>
            )}

            {/* HUD Info */}
            <div className="absolute top-4 right-4 font-mono text-xs">
               <div className={`px-2 py-1 rounded border ${
                   isError ? 'bg-red-900/50 border-red-500 text-red-200' : 
                   isSuccess ? 'bg-green-900/50 border-green-500 text-green-200' : 
                   'bg-slate-800/50 border-slate-600 text-slate-400'
               }`}>
                   STATUS: {status}
               </div>
            </div>
             <div className="absolute bottom-4 left-4 font-mono text-xs text-slate-500">
               MODULE: {levelType}
            </div>
        </div>
    );
};
