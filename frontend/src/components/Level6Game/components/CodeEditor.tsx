import React from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, readOnly = false }) => {
  return (
    <div className="w-full h-full bg-slate-900 rounded-lg border border-slate-700 overflow-hidden flex flex-col">
      <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400 flex items-center space-x-2 border-b border-slate-700">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-2 font-mono">Solution.java</span>
      </div>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        className="flex-1 w-full p-4 bg-transparent text-blue-300 font-mono text-sm resize-none focus:outline-none placeholder-slate-600 leading-relaxed"
        spellCheck={false}
        placeholder="// Write your code here..."
      />
    </div>
  );
};
