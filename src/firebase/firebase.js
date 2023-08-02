import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBKb_FABk40n0md2tDNzCgUyzeBP6BO5jE",
    authDomain: "login-a4a86.firebaseapp.com",
    projectId: "login-a4a86",
    storageBucket: "login-a4a86.appspot.com",
    messagingSenderId: "598668813812",
    appId: "1:598668813812:web:65b9029094dfd7e40485a1",
    measurementId: "G-L4ES61010Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);