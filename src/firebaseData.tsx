import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBUMirk4VaMmvIoOn-HK_aFhe8uIRQvONk",
  authDomain: "kochalka-ea73f.firebaseapp.com",
  projectId: "kochalka-ea73f",
  storageBucket: "kochalka-ea73f.appspot.com",
  messagingSenderId: "700725919611",
  appId: "1:700725919611:web:91a29149d9f243670787de",
  measurementId: "G-PR4QZNK1B8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const authFirebase = getAuth(app);
export const db = getFirestore(app);
