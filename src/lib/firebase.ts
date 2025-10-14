import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCzRyP-rBzUbEX2C_kwu5rPYXbz8xfwA98",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "intouch-dev-269817-de0b4.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "intouch-dev-269817-de0b4",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "intouch-dev-269817-de0b4.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "907465139153",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:907465139153:web:7e6e252986acc260d176f0",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-CLYRMPJ5VB"
};

// Debug: Log configuration to check if environment variables are loaded
console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? 'Loaded' : 'Missing',
  authDomain: firebaseConfig.authDomain ? 'Loaded' : 'Missing',
  projectId: firebaseConfig.projectId ? 'Loaded' : 'Missing',
  storageBucket: firebaseConfig.storageBucket ? 'Loaded' : 'Missing',
  messagingSenderId: firebaseConfig.messagingSenderId ? 'Loaded' : 'Missing',
  appId: firebaseConfig.appId ? 'Loaded' : 'Missing',
  measurementId: firebaseConfig.measurementId ? 'Loaded' : 'Missing'
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
