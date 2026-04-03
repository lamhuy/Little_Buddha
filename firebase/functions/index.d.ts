import * as functions from 'firebase-functions/v1';
/**
 * Cloud Function triggered on user account creation in Firebase Auth.
 * Automatically provisions an initial user profile document in Firestore
 * preventing the client having to perform initialization writes themselves.
 */
export declare const onUserCreated: functions.CloudFunction<import("firebase-admin/auth").UserRecord>;
