import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

admin.initializeApp();
const db = admin.firestore();

/**
 * Cloud Function triggered on user account creation in Firebase Auth.
 * Automatically provisions an initial user profile document in Firestore
 * preventing the client having to perform initialization writes themselves.
 */
export const onUserCreated = functions.auth.user().onCreate(async (user) => {
    const uid = user.uid;
    const email = user.email || '';
    
    // Use fallback name/birthyear if custom claims weren't passed during API init,
    // although client SDK standard flow registers email/pass independently of setting the profile doc.
    const name = user.displayName || 'Seeker';
    // Fallback if not injected via custom properties yet. 
    // Usually the React Native client will immediately update this document after sign up.
    const currentYear = new Date().getFullYear(); 

    try {
        const userRef = db.collection('users').doc(uid);
        await db.runTransaction(async (t) => {
            const docSnapshot = await t.get(userRef);
            if (!docSnapshot.exists) {
                t.set(userRef, {
                    name: name,
                    email: email,
                    birth_year: currentYear,
                    createdAt: FieldValue.serverTimestamp()
                });
            }
        });
        console.log(`Successfully processed user profile for UID: ${uid}`);
    } catch (error) {
        console.error(`Failed to create user profile for UID: ${uid}`, error);
    }
});
