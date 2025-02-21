// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyaSCUYF2KHoQNWWBPjUOdlLa2qfyq-YE",
  authDomain: "social-media-application-3155a.firebaseapp.com",
  projectId: "social-media-application-3155a",
  storageBucket: "social-media-application-3155a.firebasestorage.app",
  messagingSenderId: "681696528642",
  appId: "1:681696528642:web:f29893dd6e169b83471a1b"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };