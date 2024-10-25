// firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; 

// Configuración de Firebase 
const firebaseConfig = {
  apiKey: "AIzaSyDr5jb-WrsVE7gEgPLIm3xU3hnHJlegj7s",
  authDomain: "ecofashion-59130.firebaseapp.com",
  projectId: "ecofashion-59130",
  storageBucket: "ecofashion-59130.appspot.com",
  messagingSenderId: "59730218677",
  appId: "1:59730218677:web:ca92a824bd08cc18e338fc",
  measurementId: "G-VJFG2PSEGB"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth correctamente
export const auth = getAuth(app); 
