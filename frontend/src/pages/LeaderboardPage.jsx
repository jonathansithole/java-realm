// src/pages/LeaderboardPage.jsx

import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { motion } from 'framer-motion';
import { 
  Trophy, Medal, User, Crown, 
  Terminal, Search, Shield 
} from 'lucide-react';

// --- VISUAL ASSETS ---
const BackgroundGrid = () => (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:40px_40px]" />
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-900/10 dark:to-transparent" />
    </div>
);

// --- HELPER: RANK BADGES ---
const RankBadge = ({ rank }) => {
    if (rank === 0) return (
        <div className="relative flex items-center justify-center w-8 h-8 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-lg shadow-lg shadow-yellow-500/20 text-white transform scale-110">
            <Crown size={16} fill="currentColor" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow" />
        </div>
    );
    if (rank === 1) return (
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-slate-300 to-slate-500 rounded-lg shadow-lg shadow-slate-500/20 text-white">
            <Medal size={16} />
        </div>
    );
    if (rank === 2) return (
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-300 to-orange-600 rounded-lg shadow-lg shadow-orange-500/20 text-white">
            <Medal size={16} />
        </div>
    );
    return (
        <div className="flex items-center justify-center w-8 h-8 font-mono font-bold text-slate-400 dark:text-slate-500 text-sm">
            #{rank + 1}
        </div>
    );
};

export default function LeaderboardPage() {
  const [user] = useAuthState(auth);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const usersCollectionRef = collection(db, 'users');
        const q = query(usersCollectionRef, orderBy('xp', 'desc'), limit(50)); 
        const querySnapshot = await getDocs(q);
        const leaderboardData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center h-96 text-indigo-500">
             <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />

        </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full font-sans text-slate-800 dark:text-slate-200 transition-colors duration-500">
      <BackgroundGrid />
      
      <div className="relative z-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-yellow-500 p-2 rounded-lg text-white shadow-lg shadow-yellow-500/20">
                        <Trophy size={20} />
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/30 uppercase tracking-widest">
                        Season 1
                    </span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                   Rankings
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-lg">
                  Earn XP by completing missions to rise through the ranks.
                </p>
            </div>

            {/* Current User Rank Card (Small) */}
            {user && (
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-500">Your XP</div>
                        <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                            {leaderboard.find(u => u.id === user.uid)?.xp || 0}
                        </div>
                    </div>
                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
                    <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-500">Your Rank</div>
                        <div className="text-xl font-black text-slate-800 dark:text-white font-mono">
                            #{leaderboard.findIndex(u => u.id === user.uid) + 1 || '-'}
                        </div>
                    </div>
                </div>
            )}
        </div>
        
        {/* --- LEADERBOARD TABLE --- */}
        <div className="bg-white dark:bg-[#0f1422] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0a0d16] text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                <div className="col-span-2 md:col-span-1 text-center">Rank</div>
                <div className="col-span-7 md:col-span-8">Operative</div>
                <div className="col-span-3 text-right">Experience</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {leaderboard.map((player, index) => {
                    const isCurrentUser = user && user.uid === player.id;
                    return (
                        <motion.div 
                            key={player.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors duration-200
                                ${isCurrentUser 
                                    ? 'bg-indigo-50/80 dark:bg-indigo-900/10 border-l-4 border-l-indigo-500' 
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-4 border-l-transparent'
                                }
                            `}
                        >
                            {/* Rank */}
                            <div className="col-span-2 md:col-span-1 flex justify-center">
                                <RankBadge rank={index} />
                            </div>

                            {/* Player Info */}
                            <div className="col-span-7 md:col-span-8 flex items-center gap-4">
                                <div className="relative">
                                    <img 
                                        src={player.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.id}`} 
                                        alt={player.displayName} 
                                        className={`w-10 h-10 rounded-lg object-cover ${isCurrentUser ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-[#0f1422]' : ''}`} 
                                    />
                                    {index < 3 && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 border-2 border-white dark:border-[#0f1422] rounded-full" />
                                    )}
                                </div>
                                <div>
                                    <div className={`font-bold text-sm md:text-base flex items-center gap-2 ${isCurrentUser ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'}`}>
                                        {player.displayName || 'Unknown User'}
                                        {isCurrentUser && (
                                            <span className="text-[9px] bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 px-1.5 py-0.5 rounded font-mono uppercase tracking-wide hidden md:inline-block">
                                                You
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <Shield size={10} />
                                        <span>{player.rank || 'Novice'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* XP */}
                            <div className="col-span-3 text-right">
                                <div className="font-black text-lg md:text-xl text-slate-800 dark:text-white font-mono">
                                    {player.xp || 0}
                                </div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">XP</div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Empty State */}
            {leaderboard.length === 0 && (
                <div className="p-12 text-center text-slate-500">
                    <Search size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No operatives found in the database.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}