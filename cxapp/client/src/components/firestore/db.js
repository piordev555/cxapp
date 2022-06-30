import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "./config";
const firebaseApp = initializeApp(firebaseConfig);
console.log("initializing Firebase...");
export const db = getFirestore();
