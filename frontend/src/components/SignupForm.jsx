// src/components/SignupForm.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from '../firebase';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { User, Mail, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignupForm() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Password Validation State
  const [validations, setValidations] = useState({ 
    length: false, 
    uppercase: false, 
    lowercase: false, 
    number: false, 
    specialChar: false 
  });
  const [isFocused, setIsFocused] = useState(false);
  
  const isPasswordStrong = Object.values(validations).every(v => v === true);
  
  // Check if passwords match (ignore if confirm field is empty to avoid annoyance while starting to type)
  const doPasswordsMatch = password === confirmPassword || confirmPassword.length === 0;

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setValidations({
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      specialChar: /[!@#$%^&*]/.test(newPassword),
    });
  };
  
  const onSubmit = async (e) => { 
    e.preventDefault(); 
    
    if (!isPasswordStrong) { 
      setError("Security protocol failed: Password too weak."); 
      return; 
    } 
    if (password !== confirmPassword) { 
      setError("Security mismatch: Passwords do not align."); 
      return; 
    } 
    
    setIsLoading(true); 
    setError(''); 
    
    try { 
      await doCreateUserWithEmailAndPassword(email, password, displayName); 
      navigate('/map'); 
    } catch (err) { 
      setError(err.message.replace('Firebase: ', '')); 
    } finally { 
      setIsLoading(false); 
    } 
  };

  // Shared Input Style Class
  const inputClass = "w-full pl-10 pr-4 py-3 bg-[#0a0d16] border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder-slate-600 transition-all font-mono text-sm";

  return (
    <div className="w-full">
      <form onSubmit={onSubmit} className="space-y-5">
        
        {/* Name Field */}
        <div className="relative group">
            <User className="absolute left-3 top-3 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Operative Name" 
              required 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)} 
              className={inputClass}
            />
        </div>

        {/* Email Field */}
        <div className="relative group">
            <Mail className="absolute left-3 top-3 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input 
              type="email" 
              placeholder="Comms Channel (Email)" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className={inputClass}
            />
        </div>

        {/* Password Field */}
        <div className="relative group">
            <Lock className="absolute left-3 top-3 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input 
              type="password" 
              placeholder="Set Passcode" 
              required 
              value={password} 
              onChange={handlePasswordChange} 
              onFocus={() => setIsFocused(true)}
              className={inputClass}
            />
        </div>

        {/* Strength Indicator */}
        <AnimatePresence>
            {isFocused && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 text-xs">
                        <PasswordStrengthIndicator validations={validations} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Confirm Password Field */}
        <div className="relative group">
            <ShieldCheck className={`absolute left-3 top-3 transition-colors ${!doPasswordsMatch ? 'text-red-500' : 'text-slate-500 group-focus-within:text-emerald-500'}`} size={18} />
            <input 
              type="password" 
              placeholder="Confirm Passcode" 
              required 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className={`${inputClass} ${!doPasswordsMatch ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {/* Live Mismatch Warning */}
            {!doPasswordsMatch && (
               <span className="absolute right-3 top-3.5 text-xs text-red-500 font-bold animate-pulse">MISMATCH</span>
            )}
        </div>
        
        {/* General Error Message */}
        {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2 text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-900/50 text-xs">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
            </motion.div>
        )}
        
        {/* Submit Button */}
        <button 
          type="submit" 
          // Disable if loading, weak password, or passwords DON'T match
          disabled={isLoading || !isPasswordStrong || !doPasswordsMatch || confirmPassword.length === 0} 
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wider text-sm mt-2"
        >
          {isLoading ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
             'Initialize Account'
          )}
        </button>
      </form>
    </div>
  );
}