// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import getAuth for authentication
import { getFirestore } from "firebase/firestore"; // Import getFirestore for Firestore
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_28wtzm6rAURqQUJ6hqhUmnkrVTRumqU",
  authDomain: "recipefinder-bff5c.firebaseapp.com",
  projectId: "recipefinder-bff5c",
  storageBucket: "recipefinder-bff5c.firebasestorage.app",
  messagingSenderId: "979731070550",
  appId: "1:979731070550:web:4f264163341382705085f7",
  measurementId: "G-RP06MDST7R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); // Export auth
export const db = getFirestore(app); // Export db
