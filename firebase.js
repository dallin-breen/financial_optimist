// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfslq-J0FUi4GpRGVVkUCUPpLs8Uffhpw",
  authDomain: "financial-optimist-b31df.firebaseapp.com",
  projectId: "financial-optimist-b31df",
  storageBucket: "financial-optimist-b31df.appspot.com",
  messagingSenderId: "746070466213",
  appId: "1:746070466213:web:bc549b08f97a0f6a55774c",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
