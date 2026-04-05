import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBZexdfz9f4OLtoRVFzqKTS6A2iWuTJfMM",
  authDomain: "little-buddha-ff838.firebaseapp.com",
  projectId: "little-buddha-ff838",
  storageBucket: "little-buddha-ff838.firebasestorage.app",
  messagingSenderId: "625783802659",
  appId: "1:625783802659:web:456aaa9786ec4e76c15a96",
  measurementId: "G-TEMTMR6ZKK"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

// In Vite development mode, connect to Emulators
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  connectFirestoreEmulator(firestore, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
  console.log('Firebase connected to local Emulators');
}
