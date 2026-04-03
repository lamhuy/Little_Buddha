const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';

admin.initializeApp({ projectId: "demo-little-buddha" });
const db = getFirestore();

async function run() {
  try {
    const user = await admin.auth().createUser({
      email: "huylam06@gmail.com",
      password: "something",
      displayName: "Huy Lam"
    });
    console.log("Auth user created:", user.uid);

    // Wait 2 seconds for onUserCreated cloud function to execute and create the fallback doc
    await new Promise(r => setTimeout(r, 2000));

    // Set the proper birth year (assigning 2006 to put the age at 20)
    await db.collection("users").doc(user.uid).set({
      name: "Huy Lam",
      email: "huylam06@gmail.com",
      birth_year: 2020
    }, { merge: true });

    console.log("Firestore profile synchronized successfully.");
  } catch (err) {
    if (err.code === 'auth/email-already-exists') {
      console.log("Auth user already exists. Updating password and Firestore...");
      const userRecord = await admin.auth().getUserByEmail("huylam06@gmail.com");

      // Force update the auth user's password in the emulator
      await admin.auth().updateUser(userRecord.uid, {
        password: "something"
      });

      await db.collection("users").doc(userRecord.uid).set({
        name: "Huy Lam",
        email: "huylam06@gmail.com",
        birth_year: 2020
      }, { merge: true });
      console.log("Firestore profile synchronized successfully.");
    } else {
      console.error("Error creating user:", err);
    }
  }
}

run();
