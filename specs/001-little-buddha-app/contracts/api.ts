/**
 * Client Contracts Definition for Little Buddha MVP (Firebase)
 * Format: TypeScript interfaces defining Firestore Documents
 */

export interface UserProfile {
    uid: string; // Same as Firebase Auth User ID
    name: string;
    birth_year: number;
}

export interface EducationalModule {
    id?: string; // Derived from Firestore Document snapshot ID
    title: string;
    textContent: string;
    targetAgeTier: '0-7' | '8-12' | '13-18';
    audioRef: string; // Firebase Cloud Storage generic path
    summaryPoints: string[];
    discussionQuestions: string[];
}

/**
 * Expected Security Rules behavior:
 * 
 * 1. Collection `lessons`
 *    - read: if request.auth != null && 
 *            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.birth_year 
 *            evaluates to the correct `targetAgeTier` of the exact document being accessed.
 * 
 * 2. Collection `users`
 *    - read/write: if request.auth != null && request.auth.uid == resource.id
 * 
 * 3. Storage `audio`
 *    - read: if request.auth != null
 */
