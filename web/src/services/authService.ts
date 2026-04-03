import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';
import type { UserProfile } from '../types';

export const login = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);
export const logout = () => signOut(auth);
export const register = async (email: string, pass: string, name: string, birth_year: number) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;
  const profile: UserProfile = { uid: user.uid, name, birth_year };
  await setDoc(doc(firestore, 'users', user.uid), profile);
  return user;
};
