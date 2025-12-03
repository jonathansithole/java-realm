// src/pages/ForgotPasswordPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { doSendPasswordResetEmail } from '../firebase';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, ShieldAlert, CheckCircle, Lock } from 'lucide-react';

const BackgroundGrid = () => (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#0B0F19]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:40px_40px]" />
    </div>
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // This Firebase function triggers the actual email sending
      await doSendPasswordResetEmail(email);
      setMessage("System Alert: A secure reset link has been transmitted to your inbox.");
    } catch (err) {
      // Handle specific Firebase errors
      if (err.code === 'auth/user-not-found') {
        // Security best practice: Don't explicitly tell if user exists, 
        // but for this project, we can show a generic message or the specific error.
        setError("User identity not found in database.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Invalid email format detected.");
      } else {
        setError("Transmission failed: " + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-sans p-4 overflow-hidden">
      <BackgroundGrid />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md p-8 bg-[#0f1422] border border-slate-800 rounded-2xl shadow-2xl"
      >
        <div className="flex justify-center mb-6">
            <div className="bg-indigo-500/10 p-4 rounded-full border border-indigo-500/30">
                <Lock size={32} className="text-indigo-400" />
            </div>
        </div>

        <h2 className="text-2xl font-black text-center text-white mb-2 tracking-wide uppercase">
          Forgot Password
        </h2>
        <p className="text-center text-slate-400 text-sm mb-8 font-mono">
          Enter your registered email address to reset.
        </p>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-500" size={20} />
                <input 
                    type="email" 
                    placeholder="user@example.com" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full pl-10 pr-4 py-3 bg-[#0a0d16] border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-sm"
                />
            </div>
          </div>
          
          {/* Success Message */}
          {message && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-lg">
                <CheckCircle size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-emerald-300 text-xs">{message}</p>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                <ShieldAlert size={18} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-red-300 text-xs">{error}</p>
            </motion.div>
          )}
          
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
          >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                'Send Password Reset Link'
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors font-mono">
            <ArrowLeft size={16} /> Return to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}