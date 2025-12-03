import React from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, disabled }) => {
  const lines = code.split('\n');

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] rounded-lg overflow-hidden border border-slate-700 shadow-inner font-mono text-sm md:text-base">
      {/* Header */}
      <div className="flex items-center px-4 py-2 bg-[#252526] border-b border-slate-700">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="ml-4 text-slate-400 text-xs">Solution.java</span>
      </div>

      {/* Editor Area */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Line Numbers */}
        <div className="bg-[#1e1e1e] text-slate-600 text-right py-4 px-2 select-none border-r border-slate-800 w-12">
          {lines.map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="flex-1 bg-transparent text-slate-200 p-4 leading-6 outline-none resize-none whitespace-pre font-mono"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
        />
      </div>
    </div>
  );
};

export default CodeEditor;
