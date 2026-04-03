const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// ── Configuration ───────────────────────────────────────────────
const PRODUCTION_PROJECT_ID = 'little-buddha-ff838';
const USER_EMAIL = 'huylam06@gmail.com';
const USER_PASSWORD = 'something';
const USER_DISPLAY_NAME = 'Huy Lam';
const USER_BIRTH_YEAR = 2020;

const userProfile = {
  name: USER_DISPLAY_NAME,
  email: USER_EMAIL,
  birth_year: USER_BIRTH_YEAR,
};

// ── Helpers to toggle emulator env vars ─────────────────────────
function enableEmulatorEnv() {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
  process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
}

function disableEmulatorEnv() {
  delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
  delete process.env.FIRESTORE_EMULATOR_HOST;
}

// ── Emulator ────────────────────────────────────────────────────
async function upsertEmulatorUser() {
  console.log('\n── Emulator ──');
  enableEmulatorEnv();

  const emulatorApp = admin.initializeApp({ projectId: 'demo-little-buddha' }, 'emulator');
  const emulatorDb = getFirestore(emulatorApp);

  try {
    const user = await emulatorApp.auth().createUser({
      email: USER_EMAIL,
      password: USER_PASSWORD,
      displayName: USER_DISPLAY_NAME,
    });
    console.log('  Auth user created:', user.uid);
    await new Promise(r => setTimeout(r, 2000));
    await emulatorDb.collection('users').doc(user.uid).set(userProfile, { merge: true });
    console.log('  Firestore profile synchronised.');
  } catch (err) {
    if (err.code === 'auth/email-already-exists') {
      console.log('  Auth user already exists. Updating…');
      const rec = await emulatorApp.auth().getUserByEmail(USER_EMAIL);
      await emulatorApp.auth().updateUser(rec.uid, { password: USER_PASSWORD });
      await emulatorDb.collection('users').doc(rec.uid).set(userProfile, { merge: true });
      console.log('  Firestore profile synchronised.');
    } else {
      throw err;
    }
  } finally {
    await emulatorApp.delete();
  }
}

// ── Production ──────────────────────────────────────────────────
async function upsertProductionUser() {
  console.log('\n── Production ──');
  // IMPORTANT: Clear emulator env vars so the Admin SDK talks to real Firebase
  disableEmulatorEnv();

  // To get a service account key:
  // 1. Go to https://console.firebase.google.com/project/little-buddha-ff838/settings/serviceaccounts/adminsdk
  // 2. Click "Generate new private key" → save as "serviceAccountKey.json" in the functions/ folder
  // 3. DO NOT commit this file to git!
  const path = require('path');
  const keyPath = path.join(__dirname, 'serviceAccountKey.json');

  let credential;
  try {
    const serviceAccount = require(keyPath);
    credential = admin.credential.cert(serviceAccount);
    console.log('  Using service account key:', keyPath);
  } catch (e) {
    console.error('  ✗ Cannot find serviceAccountKey.json');
    console.error('    Download it from: https://console.firebase.google.com/project/little-buddha-ff838/settings/serviceaccounts/adminsdk');
    console.error('    Save it as: firebase/functions/serviceAccountKey.json');
    return;
  }

  const prodApp = admin.initializeApp({
    projectId: PRODUCTION_PROJECT_ID,
    credential,
  }, 'production');
  const prodDb = getFirestore(prodApp);

  try {
    let uid = 'smqfbz8kSbi8X2pSNjihfPfvuJje'; // Default/Fallback UID
    try {
      const rec = await prodApp.auth().getUserByEmail(USER_EMAIL);
      uid = rec.uid;
      console.log('  Auth user already exists:', uid);
      await prodApp.auth().updateUser(uid, {
        password: USER_PASSWORD,
        displayName: USER_DISPLAY_NAME,
      });
    } catch (e) {
      if (e.code === 'auth/user-not-found') {
        try {
          const user = await prodApp.auth().createUser({
            uid: uid,
            email: USER_EMAIL,
            password: USER_PASSWORD,
            displayName: USER_DISPLAY_NAME,
          });
          uid = user.uid;
          console.log('  Auth user created:', uid);
        } catch (createUserErr) {
           console.warn('  ⚠ Auth creation skipped:', createUserErr.message);
           console.warn('    Proceeding to create Firestore document using UID:', uid);
        }
      } else {
        console.warn('  ⚠ Auth lookup failed:', e.message);
        console.warn('    Proceeding to create Firestore document using UID:', uid);
      }
    }

    await prodDb.collection('users').doc(uid).set(userProfile, { merge: true });
    console.log('  Firestore profile synchronised.');
  } catch (err) {
    console.error('  ✗ Production write failed:', err.message);
    console.error('    Make sure you have run `firebase login` or set GOOGLE_APPLICATION_CREDENTIALS.');
  } finally {
    await prodApp.delete();
  }
}

// ── Main ────────────────────────────────────────────────────────
async function run() {
  try {
    await upsertEmulatorUser();
    await upsertProductionUser();
    console.log('\nDone!');
  } catch (err) {
    console.error('Fatal error:', err);
  }
  process.exit(0);
}

run();
