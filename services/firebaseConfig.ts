// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, initializeAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDi9m8Pmdfjrkg8yFM6ujhkCN25kn5V6TY",
  authDomain: "tinderclone-5e891.firebaseapp.com",
  databaseURL:
    "https://tinderclone-5e891-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tinderclone-5e891",
  storageBucket: "tinderclone-5e891.appspot.com",
  messagingSenderId: "1033007906856",
  appId: "1:1033007906856:web:289ffb2716a208743cb51d",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
