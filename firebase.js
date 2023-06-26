// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBu4fm6GJkvoZsvMOte7HIZkby8yLxlMY",
  authDomain: "financial-optimist-f60b2.firebaseapp.com",
  projectId: "financial-optimist-f60b2",
  storageBucket: "financial-optimist-f60b2.appspot.com",
  messagingSenderId: "1059597704404",
  appId: "1:1059597704404:web:5c1b1e37a741ab1be3ef41",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
