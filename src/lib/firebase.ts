import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdjfYv10LPxL3EzrRiaf8hwU61s_4QhvM",
  authDomain: "portal-2af43.firebaseapp.com",
  projectId: "portal-2af43",
  storageBucket: "portal-2af43.firebasestorage.app",
  messagingSenderId: "20127663152",
  appId: "1:20127663152:web:14c94718c87c3b0e5459f5",
  measurementId: "G-3ME559MQPJ"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
