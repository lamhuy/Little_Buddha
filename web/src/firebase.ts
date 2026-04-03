import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  projectId: "demo-little-buddha",
  apiKey: "demo-api-key",
  authDomain: "demo-little-buddha.firebaseapp.com",
  storageBucket: "demo-little-buddha.appspot.com",
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
