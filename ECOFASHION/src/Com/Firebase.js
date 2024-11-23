import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDr5jb-WrsVE7gEgPLIm3xU3hnHJlegj7s",
  authDomain: "ecofashion-59130.firebaseapp.com",
  projectId: "ecofashion-59130",
  storageBucket: "ecofashion-59130.appspot.com",
  messagingSenderId: "59730218677",
  appId: "1:59730218677:web:ca92a824bd08cc18e338fc",
  measurementId: "G-VJFG2PSEGB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;