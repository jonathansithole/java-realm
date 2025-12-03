import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types.ts';
import { Bot, User } from 'lucide-react';

interface ChatPanelProps {
  messages: ChatMessage[];
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-slate-900/80 border border-slate-700 rounded-xl overflow-hidden backdrop-blur-sm">
      <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700">
        <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Communication Log</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex space-x-3 ${msg.sender === 'EXPLORER' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.sender === 'DEBUG-BOT' ? 'bg-cyan-900 text-cyan-300' : 
              msg.sender === 'EXPLORER' ? 'bg-indigo-900 text-indigo-300' : 'bg-slate-700'
            }`}>
              {msg.sender === 'DEBUG-BOT' && <Bot size={16} />}
              {msg.sender === 'EXPLORER' && <User size={16} />}
            </div>
            
            <div className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed animate-[fadeIn_0.3s_ease-out] ${
               msg.sender === 'DEBUG-BOT' ? 'bg-cyan-950/50 border border-cyan-800/50 text-cyan-100 rounded-tl-none' : 
               msg.sender === 'EXPLORER' ? 'bg-indigo-950/50 border border-indigo-800/50 text-indigo-100 rounded-tr-none' : 
               'bg-slate-800 text-slate-300'
            }`}>
              <p className="font-bold text-xs opacity-70 mb-1">{msg.sender}</p>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatPanel;