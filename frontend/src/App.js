// src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

// Import Pages and Layouts
import MainLayout from './components/MainLayout';
import Home from './pages/Home'; // The new Cinematic Landing Page
import WelcomePage from './pages/WelcomePage'; // The Login/Signup Forms
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import WorldMap from './pages/WorldMap';
import Level from './pages/Level';
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';

// --- ROUTE GUARD: PROTECTED (Must be logged in) ---
const ProtectedRoute = () => {
  const [user, loading] = useAuthState(auth);
  
  if (loading) {
    // A simple dark-themed loader to match your app's style
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center font-mono text-indigo-500">
            <div className="animate-pulse">AUTHENTICATING ACCESS...</div>
        </div>
    );
  }
  
  // If logged in, show content. If not, send to Login page.
  return user ? <Outlet /> : <Navigate to="/login" />;
};

// --- ROUTE GUARD: PUBLIC ONLY (Must be logged OUT) ---
const PublicRoute = () => {
    const [user, loading] = useAuthState(auth);
    
    if (loading) {
      return null; // Or a loader
    }
    
    // If user is already logged in, send them straight to the Game Map
    return user ? <Navigate to="/map" /> : <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- 1. THE LANDING PAGE (Root) --- */}
        {/* Accessible by everyone. The Home.jsx handles its own "Resume" vs "Login" button logic */}
        <Route path="/" element={<Home />} />

        {/* --- 2. AUTHENTICATION ROUTES (Guest Only) --- */}
        <Route element={<PublicRoute />}>
            {/* We moved WelcomePage to /login because / is now Home */}
            <Route path="/login" element={<WelcomePage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* --- 3. THE GAME (Protected) --- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/map" element={<WorldMap />} />
            <Route path="/level/:worldId/:levelId" element={<Level />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            
            {/* Catch-all for logged-in users: go to map */}
            <Route path="*" element={<Navigate to="/map" />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}