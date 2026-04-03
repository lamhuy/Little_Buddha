import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import type { EducationalModule } from '../types';

export const getLessonsForAgeTier = async (tier: '0-7' | '8-12' | '13-18') => {
  const q = query(collection(firestore, 'lessons'), where('targetAgeTier', '==', tier));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EducationalModule));
};

export const getLesson = async (id: string) => {
  const docRef = doc(firestore, 'lessons', id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as EducationalModule;
  }
  return null;
};
