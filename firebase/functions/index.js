"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.onUserCreated = void 0;
const functions = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
admin.initializeApp();
const db = admin.firestore();
/**
 * Cloud Function triggered on user account creation in Firebase Auth.
 * Automatically provisions an initial user profile document in Firestore
 * preventing the client having to perform initialization writes themselves.
 */
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
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
                    createdAt: firestore_1.FieldValue.serverTimestamp()
                });
            }
        });
        console.log(`Successfully processed user profile for UID: ${uid}`);
    }
    catch (error) {
        console.error(`Failed to create user profile for UID: ${uid}`, error);
    }
});
//# sourceMappingURL=index.js.map