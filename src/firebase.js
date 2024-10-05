import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // Jangan lupa import getFirestore
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAHijdFVFTP1JWuMXf1ge20NQWTVtDZdJ8",
  authDomain: "sidangmahasiswa.firebaseapp.com",
  projectId: "sidangmahasiswa",
  storageBucket: "sidangmahasiswa.appspot.com",
  messagingSenderId: "495306210084",
  appId: "1:495306210084:web:1ac3ac20bc35ea5bc651b1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Pastikan ini menginisialisasi Firestore dengan app yang benar
const auth = getAuth(app);
export { db, auth };