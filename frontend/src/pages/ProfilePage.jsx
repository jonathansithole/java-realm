// src/pages/ProfilePage.jsx

import React, { useEffect, useState, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase'; // Ensure storage is imported
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Zap, Shield, Award, Terminal, Activity, 
  Lock, Hash, Camera, Upload, X, Check, Image as ImageIcon 
} from 'lucide-react';

// --- VISUAL ASSETS ---
const BackgroundGrid = () => (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:40px_40px]" />
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-100 to-transparent dark:from-[#0B0F19] dark:to-transparent" />
    </div>
);

// --- COMPONENT: STAT CARD ---
const StatCard = ({ label, value, icon: Icon, color, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="relative overflow-hidden bg-white dark:bg-[#0f1422] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-none group"
    >
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500 ${color}`}>
            <Icon size={64} />
        </div>
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 ${color.replace('text-', '')}`}>
                    <Icon size={18} className={color} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</span>
            </div>
            <div className="text-3xl font-black text-slate-800 dark:text-white font-mono tracking-tight">
                {value}
            </div>
        </div>
    </motion.div>
);

// --- COMPONENT: BADGE DISPLAY ---
const BadgeDisplay = ({ badge, isUnlocked, index }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.05 }}
    className={`relative group flex flex-col items-center text-center p-6 border rounded-xl transition-all duration-300
      ${isUnlocked 
        ? 'bg-white dark:bg-[#0f1422] border-indigo-200 dark:border-indigo-500/30 shadow-lg dark:shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-70 grayscale'}`
    }
  >
    {isUnlocked && <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent rounded-xl pointer-events-none" />}
    <div className="relative mb-4">
        <div className={`text-5xl transition-transform duration-300 ${isUnlocked ? 'group-hover:scale-110 drop-shadow-md' : 'opacity-50'}`}>
            {badge.icon}
        </div>
        {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center">
                <Lock size={24} className="text-slate-400 dark:text-slate-600" />
            </div>
        )}
    </div>
    <h3 className={`font-bold text-sm mb-2 ${isUnlocked ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
        {badge.name}
    </h3>
    <div className="h-10 flex items-center justify-center">
        <p className={`text-[10px] leading-tight ${isUnlocked ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400 dark:text-slate-600 font-mono'}`}>
        {isUnlocked ? badge.description : '/// LOCKED DATA ///'}
        </p>
    </div>
    <div className={`mt-4 text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${isUnlocked ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-600 border-slate-300 dark:border-slate-700'}`}>
        {isUnlocked ? 'Acquired' : 'Missing'}
    </div>
  </motion.div>
);

// --- COMPONENT: AVATAR SELECTOR MODAL ---
const AvatarModal = ({ isOpen, onClose, currentUser, onUpdate }) => {
    const [selectedPreset, setSelectedPreset] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Generate cool sci-fi presets using DiceBear
    const presets = Array.from({ length: 8 }).map((_, i) => 
        `https://api.dicebear.com/7.x/bottts/svg?seed=Operative${i + Math.floor(Math.random() * 100)}`
    );

    const handlePresetSelect = async (url) => {
        setUploading(true);
        await onUpdate(url);
        setUploading(false);
        onClose();
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            // 1. Create a reference in Firebase Storage
            const storageRef = ref(storage, `avatars/${currentUser.uid}`);
            
            // 2. Upload the file
            await uploadBytes(storageRef, file);
            
            // 3. Get the URL
            const downloadURL = await getDownloadURL(storageRef);
            
            // 4. Update Profile
            await onUpdate(downloadURL);
            onClose();
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-[#0f1422] w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0a0d16]">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Camera size={20} className="text-indigo-500" /> Modify Identity
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Upload Section */}
                    <div className="mb-8">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Custom Upload</p>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-indigo-500 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all group"
                        >
                            {uploading ? (
                                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Upload size={24} className="group-hover:-translate-y-1 transition-transform" />
                                    <span className="text-sm font-medium">Click to upload image file</span>
                                </>
                            )}
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileUpload} 
                            accept="image/*" 
                            className="hidden" 
                        />
                    </div>

                    {/* Presets Section */}
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">System Presets</p>
                        <div className="grid grid-cols-4 gap-3">
                            {presets.map((url, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handlePresetSelect(url)}
                                    className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:ring-2 ring-indigo-500 transition-all bg-slate-100 dark:bg-slate-800"
                                >
                                    <img src={url} alt="Preset" className="w-full h-auto" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// --- MAIN COMPONENT ---
export default function ProfilePage() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [allBadges, setAllBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Avatar Modal State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Fetch Data
  const fetchProfileData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    // 1. Fetch user
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      setUserData(userDoc.data());
    }

    // 2. Fetch Badges
    const allBadgesMap = new Map();
    const worldsCollectionRef = collection(db, 'worlds');
    const worldsSnapshot = await getDocs(worldsCollectionRef);
    
    for (const worldDoc of worldsSnapshot.docs) {
      const levelsCollectionRef = collection(worldDoc.ref, 'levels');
      const levelsSnapshot = await getDocs(levelsCollectionRef);
      levelsSnapshot.forEach(levelDoc => {
        const levelData = levelDoc.data();
        if (levelData.badge && !allBadgesMap.has(levelData.badge.name)) {
          allBadgesMap.set(levelData.badge.name, levelData.badge);
        }
      });
    }
    setAllBadges(Array.from(allBadgesMap.values()));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  // Handle Avatar Update
  const handleUpdateAvatar = async (newUrl) => {
      try {
          // 1. Update Firebase Auth Profile (Current Session)
          await updateProfile(user, { photoURL: newUrl });
          
          // 2. Update Firestore User Document (Persistent Data)
          const userDocRef = doc(db, 'users', user.uid);
          await updateDoc(userDocRef, { photoURL: newUrl });

          // 3. Update Local State
          setUserData(prev => ({ ...prev, photoURL: newUrl }));
          
          // Force reload of user to ensure Auth object is fresh (optional but helpful)
          await user.reload();

      } catch (error) {
          console.error("Error updating avatar:", error);
      }
  };

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-indigo-500">
             <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
             <div className="text-xs font-mono animate-pulse">DECRYPTING USER DATA...</div>
        </div>
    );
  }

  if (!userData) {
    return <div className="text-center p-10 font-bold text-red-500">Error: User data unavailable.</div>;
  }

  const userEarnedBadges = new Set(userData.badges || []);

  return (
    <div className="relative min-h-screen w-full font-sans text-slate-800 dark:text-slate-200 transition-colors duration-500">
      <BackgroundGrid />
      
      {/* Avatar Selection Modal */}
      <AnimatePresence>
        {isAvatarModalOpen && (
            <AvatarModal 
                isOpen={isAvatarModalOpen} 
                onClose={() => setIsAvatarModalOpen(false)}
                currentUser={user}
                onUpdate={handleUpdateAvatar}
            />
        )}
      </AnimatePresence>
      
      <div className="relative z-10">
          
          {/* --- HEADER DOSSIER --- */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
              <div className="relative group cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-[#0B0F19] shadow-xl overflow-hidden relative">
                    <img 
                        src={userData.photoURL || user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="absolute -bottom-3 -right-3 bg-indigo-500 text-white p-1.5 rounded-lg border-4 border-white dark:border-[#0B0F19] transition-transform group-hover:scale-110">
                      <ImageIcon size={16} />
                  </div>
              </div>
              
              <div className="text-center md:text-left flex-grow">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                      <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        {userData.displayName || 'Unknown Operative'}
                      </h1>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700">
                        Active
                      </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-mono text-sm flex items-center justify-center md:justify-start gap-2">
                     <Terminal size={12} /> ID: {user.uid.substring(0, 8).toUpperCase()}
                  </p>
              </div>

              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center min-w-[140px]">
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Current Level</div>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                      {Math.floor(userData.currentLevel || 1)}
                  </div>
              </div>
          </div>

          {/* --- STATS OVERVIEW --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard 
                label="Operative Rank" 
                value={userData.rank || 'Novice'} 
                icon={Shield} 
                color="text-purple-500"
                delay={0} 
            />
            <StatCard 
                label="Total Experience" 
                value={userData.xp || 0} 
                icon={Zap} 
                color="text-yellow-500"
                delay={0.1} 
            />
            <StatCard 
                label="Badges Acquired" 
                value={`${userEarnedBadges.size} / ${allBadges.length}`} 
                icon={Award} 
                color="text-emerald-500"
                delay={0.2} 
            />
          </div>

          {/* --- BADGE COLLECTION --- */}
          <div>
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                    <Trophy size={18} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Achievements Database</h2>
                <div className="h-px flex-grow bg-slate-200 dark:bg-slate-800 ml-4"></div>
            </div>

            {allBadges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {allBadges.map((badge, index) => (
                  <BadgeDisplay 
                    key={badge.name}
                    badge={badge}
                    index={index}
                    isUnlocked={userEarnedBadges.has(badge.name)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-slate-100 dark:bg-slate-900 p-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                <Hash size={32} className="mx-auto text-slate-400 mb-2" />
                <p className="text-slate-500 dark:text-slate-400">No badge data found in the system.</p>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}