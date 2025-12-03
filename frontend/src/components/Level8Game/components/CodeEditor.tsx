import React from 'react';
import { Terminal, Play } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (val: string) => void;
  onRun: () => void;
  disabled: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, onRun, disabled }) => {
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newValue = code.substring(0, start) + "    " + code.substring(end);
      onChange(newValue);
      
      // Need to set timeout to update cursor position after render
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center space-x-2 text-slate-300">
          <Terminal size={16} />
          <span className="text-xs font-mono font-bold">TERMINAL_V8.0</span>
        </div>
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
        </div>
      </div>

      {/* Editor Area */}
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        spellCheck={false}
        className="flex-1 bg-[#0d1117] text-green-400 font-mono p-4 text-sm md:text-base resize-none focus:outline-none focus:ring-2 focus:ring-slate-700/50 leading-relaxed"
        style={{ fontFamily: '"Fira Code", "Courier New", monospace' }}
      />

      {/* Action Bar */}
      <div className="bg-slate-800 p-3 border-t border-slate-700 flex justify-end">
        <button
          onClick={onRun}
          disabled={disabled}
          className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-bold transition-all ${
            disabled 
              ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] active:scale-95'
          }`}
        >
          <Play size={18} fill="currentColor" />
          <span>COMPILE & RUN</span>
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;