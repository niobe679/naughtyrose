import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "naughtyrose69.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "naughtyrose69",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "naughtyrose69.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000000000",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
};

export const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, { ignoreUndefinedProperties: true });
export const auth = getAuth(app);

let analytics: ReturnType<typeof getAnalytics> | null = null;
try {
  analytics = getAnalytics(app);
} catch {
  // Analytics not available in some environments
}
export { analytics };
