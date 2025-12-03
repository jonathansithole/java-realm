
import React, { useState, useEffect } from 'react';
import { Play, AlertTriangle, CheckCircle2, Code2, Lightbulb, X } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onExecute: () => void;
  error: string | null;
  title: string;
  description: string;
  isSolved: boolean;
  hint: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  code, 
  onChange, 
  onExecute, 
  error,
  title,
  description,
  isSolved,
  hint
}) => {
  const [showHint, setShowHint] = useState(false);

  // Reset hint visibility when puzzle changes
  useEffect(() => {
    setShowHint(false);
  }, [title]);

  return (
    <div className="flex flex-col h-full bg-gray-950 border-r border-cyan-900/30 relative shadow-2xl">
      {/* Header - Instructions & Hint */}
      <div className="bg-gray-900 p-5 border-b border-cyan-900/30 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-cyan-400 font-bold tracking-wider text-lg">{title}</h2>
          </div>
          {isSolved && (
            <div className="flex items-center gap-1 text-green-400 bg-green-950/30 px-2 py-1 rounded border border-green-900/50">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold">SOLVED</span>
            </div>
          )}
        </div>
        
        <div className="text-gray-300 text-sm font-sans leading-relaxed bg-black/20 p-3 rounded border border-gray-800 whitespace-pre-line mb-3">
          {description}
        </div>

        {/* Hint Section */}
        <div className="flex items-start gap-2">
           {!showHint ? (
             <button 
               onClick={() => setShowHint(true)}
               className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 text-xs font-bold uppercase tracking-wider transition-colors"
             >
               <Lightbulb className="w-4 h-4" />
               Need a Hint?
             </button>
           ) : (
             <div className="flex-1 bg-yellow-950/20 border border-yellow-600/30 rounded p-3 animate-in fade-in slide-in-from-top-2">
               <div className="flex justify-between items-start">
                 <div className="flex gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-yellow-500 font-bold text-xs uppercase block mb-1">Hint System</span>
                      <p className="text-gray-300 text-sm">{hint}</p>
                    </div>
                 </div>
                 <button onClick={() => setShowHint(false)} className="text-gray-500 hover:text-gray-300">
                   <X className="w-4 h-4" />
                 </button>
               </div>
             </div>
           )}
        </div>
      </div>

      {/* Editor Area - Flex Grow/Scrollable */}
      <div className="flex-1 relative min-h-0 bg-[#0a0a0a]">
        {/* Line Numbers */}
        <div className="absolute top-0 left-0 bottom-0 w-12 bg-[#111] border-r border-gray-800 text-right text-gray-600 text-sm pt-6 pr-3 font-mono select-none">
          {code.split('\n').map((_, i) => (
            <div key={i} className="h-6 leading-6">{i + 1}</div>
          ))}
        </div>

        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full bg-transparent text-gray-200 p-6 pl-16 font-mono text-sm resize-none focus:outline-none focus:bg-[#0f0f0f] leading-6 selection:bg-cyan-900/50"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
        />
      </div>

      {/* Feedback Area */}
      {error && (
        <div className="bg-red-950/30 p-3 border-t border-red-900/50 flex items-center gap-3 shrink-0 animate-in slide-in-from-bottom-2">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          <span className="text-red-200 text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Controls - Always Visible Footer */}
      <div className="p-4 bg-gray-900 border-t border-cyan-900/30 shrink-0 z-10">
        <button
          onClick={onExecute}
          disabled={isSolved}
          className={`w-full font-bold text-lg py-4 rounded flex items-center justify-center gap-2 transition-all uppercase tracking-widest shadow-lg
            ${isSolved 
              ? 'bg-green-600 text-black cursor-default' 
              : 'bg-cyan-600 hover:bg-cyan-500 text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-[0.99]'
            }`}
        >
          {isSolved ? (
            <>
              <CheckCircle2 className="w-6 h-6" />
              System Stabilized
            </>
          ) : (
            <>
              <Play className="w-6 h-6 fill-current" />
              Run Code
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
