import { firestore } from '../services/firebaseConfig';
import { EducationalModule } from '../models/types';

export const lessonService = {
  /**
   * Fetches lessons tailored to the user's age tier based on Firebase Security Rules filtering.
   * If the Security Rule fails (client asks for wrong tier), permission is denied.
   */
  async getLessons(targetAgeTier: string): Promise<{ success: boolean; data?: EducationalModule[]; error?: string }> {
    try {
      // Firestore queries returning collections must be explicitly filtered exactly as configured in indexes 
      // or match Security Rules constraints explicitly if the rules demand exact field matching.
      const snapshot = await firestore()
        .collection('lessons')
        .where('targetAgeTier', '==', targetAgeTier)
        .get();
      
      const lessons: EducationalModule[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<EducationalModule, 'id'>)
      }));

      return { success: true, data: lessons };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async getLessonDetail(id: string): Promise<{ success: boolean; data?: EducationalModule; error?: string }> {
    try {
      const doc = await firestore().collection('lessons').doc(id).get();
      if (!doc.exists) {
        throw new Error('Lesson not found');
      }
      return { success: true, data: { id: doc.id, ...(doc.data() as Omit<EducationalModule, 'id'>) } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};
