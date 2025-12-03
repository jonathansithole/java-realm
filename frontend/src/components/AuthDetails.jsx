// src/components/AuthDetails.jsx

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, doSignOut } from '../firebase';
import { Link } from 'react-router-dom';

export default function AuthDetails() {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
    });
    return () => {
      listen();
    };
  }, []);

  const handleSignOut = async () => {
    await doSignOut();
  };

  return (
    <div className="absolute top-4 right-4 z-20">
      {authUser ? (
        <div className="flex items-center space-x-4 bg-black/40 p-2 rounded-lg border border-gray-700">
          <img src={authUser.photoURL} alt={authUser.displayName} className="w-10 h-10 rounded-full" />
          <p className="text-white font-semibold">Welcome, {authUser.displayName}!</p>
          <button onClick={handleSignOut} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
            Log Out
          </button>
        </div>
      ) : (
        <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
          Login
        </Link>
      )}
    </div>
  );
}