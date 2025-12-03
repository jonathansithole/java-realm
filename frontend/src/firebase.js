// src/firebase.js

import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile 
} from "firebase/auth";

import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
// 1. IMPORT STORAGE
import { getStorage } from "firebase/storage"; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYdRIUFd1L3RC9LJtwH-lY_dZVh4fyLQg",
  authDomain: "gamificationproject-fea30.firebaseapp.com",
  projectId: "gamificationproject-fea30",
  storageBucket: "gamificationproject-fea30.firebasestorage.app", // This is crucial for uploads
  messagingSenderId: "700152238913",
  appId: "1:700152238913:web:963c67726a2ce2451887c0",
  measurementId: "G-C0SYL74P4B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// 2. INITIALIZE AND EXPORT STORAGE
export const storage = getStorage(app); 

// --- HELPER FUNCTION TO CREATE USER DOCUMENT IN FIRESTORE ---
const createUserDocument = async (user, additionalData = {}) => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
        const { displayName, email, photoURL } = user;
        const createdAt = new Date();
        try {
            await setDoc(userDocRef, {
                displayName: displayName || additionalData.displayName,
                email,
                photoURL: photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${displayName || additionalData.displayName}`,
                createdAt,
                uid: user.uid,
                xp: 0,
                rank: "Beginner",
                dailyStreak: 0,
                currentLevel: 1.1,
                badges: [],
                lastLogin: createdAt,
                ...additionalData,
            });
        } catch (error) {
            console.error("Error creating user document:", error);
        }
    }
};

// --- AUTHENTICATION FUNCTIONS ---

// Sign in with Google
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    await createUserDocument(result.user);
    return result.user;
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    return null;
  }
};

// Sign up with Email and Password
export const doCreateUserWithEmailAndPassword = async (email, password, displayName) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    // Update the user's profile with their name
    await updateProfile(user, { displayName });
    // Create their document in Firestore
    await createUserDocument(user, { displayName });
    return user;
};

// Sign in with Email and Password
export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

// Password Reset
export const doSendPasswordResetEmail = (email) => {
    return sendPasswordResetEmail(auth, email);
};

// Sign out
export const doSignOut = () => {
  return signOut(auth);
};