import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// In a real app, this would use react-native-config or similar
const USE_EMULATOR = true;

if (__DEV__ && USE_EMULATOR) {
  // Use a local IP address for physical Android devices; localhost is fine for iOS sim
  // If your emulator is on the same machine, 'localhost' often maps internally or use '10.0.2.2' for Android
  const host = 'localhost'; 
  
  auth().useEmulator(`http://${host}:9099`);
  firestore().useEmulator(host, 8080);
  storage().useEmulator(host, 9199);
  
  console.log(`Firebase connected to Emulators at ${host}`);
}

export { auth, firestore, storage };
