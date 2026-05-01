import firestore from '@react-native-firebase/firestore';
import type { EducationalModule } from '../models/types';

export const getLessonsForAgeTier = async (tier: '0-7' | '8-12' | '13-18'): Promise<EducationalModule[]> => {
  const snapshot = await firestore()
    .collection('lessons')
    .where('targetAgeTier', '==', tier)
    .get();
    
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EducationalModule));
};

export const getLesson = async (id: string): Promise<EducationalModule | null> => {
  const doc = await firestore().collection('lessons').doc(id).get();
  
  if (doc.exists()) {
    return { id: doc.id, ...doc.data() } as EducationalModule;
  }
  return null;
};
