import {initializeApp, getApps} from 'firebase/app';
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
const env=import.meta.env;
export const firebaseReady=Boolean(env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID && env.VITE_FIREBASE_AUTH_DOMAIN && env.VITE_FIREBASE_APP_ID);
const config={apiKey:env.VITE_FIREBASE_API_KEY,authDomain:env.VITE_FIREBASE_AUTH_DOMAIN,projectId:env.VITE_FIREBASE_PROJECT_ID,appId:env.VITE_FIREBASE_APP_ID,storageBucket:env.VITE_FIREBASE_STORAGE_BUCKET,messagingSenderId:env.VITE_FIREBASE_MESSAGING_SENDER_ID};
const app=firebaseReady ? (getApps()[0]??initializeApp(config)):null;
export const auth=app?getAuth(app):null;
export const db=app?getFirestore(app):null;
export async function login(){if(!auth)throw new Error('Firebase não configurado.');await signInWithPopup(auth,new GoogleAuthProvider());}
export async function logout(){if(auth)await signOut(auth);}
