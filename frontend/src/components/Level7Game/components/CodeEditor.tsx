import React from 'react';

interface CodeEditorProps {
    code: string;
    onChange: (code: string) => void;
    readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, readOnly = false }) => {
    return (
        <div className="w-full h-64 bg-slate-900 rounded-lg border-2 border-slate-700 overflow-hidden flex flex-col shadow-inner">
            <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
                <span className="text-slate-400 text-xs font-mono">System.java</span>
                <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
            </div>
            <textarea
                value={code}
                onChange={(e) => onChange(e.target.value)}
                readOnly={readOnly}
                spellCheck={false}
                className={`flex-1 p-4 font-mono text-sm text-cyan-300 bg-slate-900 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/30 ${readOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
                placeholder="// Enter your code here..."
            />
        </div>
    );
};
