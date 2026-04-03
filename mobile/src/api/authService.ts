import { auth, firestore } from './firebaseConfig';
import FirebaseAuth from '@react-native-firebase/auth';

/**
 * Auth Service interacting with Firebase Authentication and Firestore
 */
export const authService = {
  async register(email: string, password: string, name: string, birthYear: number) {
    try {
      // 1. Create the user in Firebase Auth
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      
      // 2. The Cloud function will trigger and create a stub doc. 
      // We immediately update it with the true name and birth year.
      await firestore().collection('users').doc(userCredential.user.uid).set({
        name,
        birth_year: birthYear,
        email,
      }, { merge: true }); // Merge ensures we update what the Cloud Function initialized
      
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async login(email: string, password: string) {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      
      // Fetch user profile data to load context
      const docSnap = await firestore().collection('users').doc(userCredential.user.uid).get();
      const userData = docSnap.data();

      // Retrieve JWT if needed elsewhere
      const idToken = await userCredential.user.getIdToken();

      return { 
        success: true, 
        user: userCredential.user, 
        claims: {
          name: userData?.name || 'Seeker',
          birthYear: userData?.birth_year || 0,
          jwt: idToken
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async logout() {
    await auth().signOut();
  }
};
