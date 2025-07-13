import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnh8ExE_le-GaOw3gkooNKLqryBF5ItNY",
  authDomain: "sistema-crm-compina.firebaseapp.com",
  projectId: "sistema-crm-compina",
  storageBucket: "sistema-crm-compina.firebasestorage.app",
  messagingSenderId: "916956050513",
  appId: "1:916956050513:web:de337b89798650594bf470"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);