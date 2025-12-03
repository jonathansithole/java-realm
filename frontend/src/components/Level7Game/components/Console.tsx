import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types.ts';

interface ConsoleProps {
    logs: LogEntry[];
}

export const Console: React.FC<ConsoleProps> = ({ logs }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="w-full h-48 bg-black rounded-lg border border-slate-700 p-4 overflow-y-auto font-mono text-xs shadow-inner custom-scrollbar">
            <div className="text-slate-500 mb-2 border-b border-slate-800 pb-1">
                 FORTRESS_SYS_LOG v7.0.1 initiated...
            </div>
            {logs.map((log) => (
                <div key={log.id} className="mb-1">
                    <span className="text-slate-600 mr-2">[{log.timestamp.toLocaleTimeString([], {hour12:false, hour:'2-digit', minute:'2-digit', second:'2-digit'})}]</span>
                    <span className={`
                        ${log.type === 'error' ? 'text-red-400 font-bold' : ''}
                        ${log.type === 'success' ? 'text-green-400' : ''}
                        ${log.type === 'info' ? 'text-cyan-200' : ''}
                    `}>
                        {log.type === 'error' ? '❌ ' : log.type === 'success' ? '✔ ' : '> '}
                        {log.message}
                    </span>
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
};
