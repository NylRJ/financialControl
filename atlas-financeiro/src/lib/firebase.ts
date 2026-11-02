import {initializeApp, getApps} from 'firebase/app';
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

// Configuração pública do aplicativo Web registrado no Firebase.
// Variáveis VITE_FIREBASE_* podem sobrescrever estes valores por ambiente.
// Nunca coloque credenciais de service account ou chaves privadas no frontend.
const env = import.meta.env;
const config = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyCTw7wfYRoATh_OYbOQuT-7iXt8_itaFL4',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'atlas-financeiro-be375.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'atlas-financeiro-be375',
  appId: env.VITE_FIREBASE_APP_ID || '1:599679642779:web:edf92cb4b774e388a02a3e',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'atlas-financeiro-be375.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '599679642779',
};
export const firebaseReady = Boolean(config.apiKey && config.projectId && config.authDomain && config.appId);
const app = firebaseReady ? (getApps()[0] ?? initializeApp(config)) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export async function login() {
  if (!auth) throw new Error('Firebase não configurado.');
  await signInWithPopup(auth, new GoogleAuthProvider());
}
export async function logout() {
  if (auth) await signOut(auth);
}
