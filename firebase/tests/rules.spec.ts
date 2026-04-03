import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import * as fs from 'fs';
import * as path from 'path';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  const rules = fs.readFileSync(path.resolve(__dirname, '../firestore.rules'), 'utf8');
  
  testEnv = await initializeTestEnvironment({
    projectId: 'little-buddha-test',
    firestore: {
      rules,
      host: '127.0.0.1',
      port: 8080 
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

describe('Firestore Security Rules', () => {
  
  describe('Users Collection', () => {
    it('should allow authenticating users to read and write their own profile doc', async () => {
      const context = testEnv.authenticatedContext('user_123', {});
      const db = context.firestore();
      
      const userDocRef = db.doc('users/user_123');
      await expect(userDocRef.set({ name: 'Test', birth_year: 2010 })).resolves.toBeUndefined();
      
      const snap = await userDocRef.get();
      expect(snap.exists).toBe(true);
    });
  });

  describe('Lessons Collection (Age Gates)', () => {
    beforeEach(async () => {
      // Setup some test lessons bypassing rules
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore();
        await adminDb.doc('lessons/child_lesson').set({ targetAgeTier: '0-7', title: 'Child Lesson' });
        await adminDb.doc('lessons/teen_lesson').set({ targetAgeTier: '13-18', title: 'Teen Lesson' });
      });
    });

    it('should allow a 6 year old to read 0-7 tier lessons', async () => {
      // 1. Setup the user profile mimicking a 6 year old 
      const currentYear = new Date().getFullYear();
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().doc(`users/kid_uuid`).set({ birth_year: currentYear - 6 });
      });

      // 2. Test access as that user
      const kidContext = testEnv.authenticatedContext('kid_uuid');
      const db = kidContext.firestore();

      // Can read child lesson
      await expect(db.doc('lessons/child_lesson').get()).resolves.toBeDefined();
      
      // Cannot read teen lesson
      await expect(db.doc('lessons/teen_lesson').get()).rejects.toThrow();
    });
  });
});
