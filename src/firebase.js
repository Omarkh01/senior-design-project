import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBUJ3dQbGQYzRtPIiygrU9h0k1T46UJm5M",
  authDomain: "chatapp-8f9f1.firebaseapp.com",
  projectId: "chatapp-8f9f1",
  storageBucket: "chatapp-8f9f1.appspot.com",
  messagingSenderId: "129191843538",
  appId: "1:129191843538:web:1727eda6d351c39eb5bf0b",
  measurementId: "G-KXK52MB7N1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
