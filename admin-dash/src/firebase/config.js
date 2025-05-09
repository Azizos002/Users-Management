// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB2gfeLkHM1LFtp2FXpxroWeYtegSJw1Oo",
  authDomain: "appbus-5d145.firebaseapp.com",
  projectId: "appbus-5d145",
  storageBucket: "appbus-5d145.appspot.com",
  messagingSenderId: "660735888287",
  appId: "1:660735888287:web:c5582b2ba188065b69cbaa",
  measurementId: "G-55GCBSJCHB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };