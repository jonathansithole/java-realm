// src/components/LoginForm.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doSignInWithEmailAndPassword, signInWithGoogle } from '../firebase';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => { 
    e.preventDefault(); 
    setIsLoading(true); 
    setError(''); 
    
    try { 
      await doSignInWithEmailAndPassword(email, password); 
      navigate('/map'); 
    } catch (err) { 
      setError(err.message.replace('Firebase: ', '')); 
    } finally { 
      setIsLoading(false); 
    } 
  };

  const onGoogleSignIn = async () => { 
    setIsLoading(true); 
    setError(''); 
    
    try { 
      await signInWithGoogle(); 
      navigate('/map'); 
    } catch (err) { 
      setError(err.message.replace('Firebase: ', '')); 
    } finally { 
      setIsLoading(false); 
    } 
  };

  // Consistent Input Styling
  const inputClass = "w-full pl-10 pr-4 py-3 bg-[#0a0d16] border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-600 transition-all font-mono text-sm";

  return (
    <div className="w-full">
      <form onSubmit={onSubmit} className="space-y-5">
        
        {/* Email Field */}
        <div className="relative group">
            <Mail className="absolute left-3 top-3 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="email" 
              placeholder="Operative ID (Email)" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className={inputClass}
            />
        </div>

        {/* Password Field */}
        <div className="relative group">
            <Lock className="absolute left-3 top-3 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="password" 
              placeholder="Passcode" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className={inputClass}
            />
        </div>

        {/* Error Message */}
        {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2 text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-900/50 text-xs">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
            </motion.div>
        )}

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isLoading} 
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
        >
          {isLoading ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
             <>Login <ArrowRight size={16} /></>
          )}
        </button>
      </form>

      {/* Forgot Password Link */}
      <div className="text-center mt-4">
        <Link to="/forgot-password" className="text-xs font-mono text-slate-500 hover:text-indigo-400 transition-colors">
            [ Reset Access Codes? ]
        </Link>
      </div>

      {/* Divider */}
      <div className="relative flex items-center my-6">
        <div className="flex-grow border-t border-slate-800"></div>
        <span className="flex-shrink mx-4 text-slate-600 text-[10px] uppercase font-bold tracking-widest">Or Authenticate With</span>
        <div className="flex-grow border-t border-slate-800"></div>
      </div>

      {/* Google Button */}
      <button 
        onClick={onGoogleSignIn} 
        disabled={isLoading} 
        className="w-full px-4 py-3 flex items-center justify-center font-bold text-slate-300 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all disabled:opacity-50 text-sm"
      >
        <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,36.626,44,31.023,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
        Google Account
      </button>
    </div>
  );
}