
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// https://firebase.google.com/docs/web/setup#available-libraries

//Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjjL9kY2KwxhAE-YenJddtmQGh5xkktGQ",
  authDomain: "recipe-finder-and-grocery-list.firebaseapp.com",
  projectId: "recipe-finder-and-grocery-list",
  storageBucket: "recipe-finder-and-grocery-list.appspot.com",
  messagingSenderId: "523038321442",
  appId: "1:523038321442:web:19bff77a7cb9ed001ad37b",
  measurementId: "G-MWVPQBGWSZ"
};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);