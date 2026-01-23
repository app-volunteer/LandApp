// @ts-ignore
import { initializeApp } from "firebase/app";
// @ts-ignore
import { getAuth, onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { 
  getFirestore, 
  collection, 
  getDocs, 
  setDoc, 
  addDoc,
  doc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy,
  deleteDoc,
  updateDoc
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsDwsrl4f866azToJWTu_vj4JBMpQXe_c",
  authDomain: "landreportapp.firebaseapp.com",
  projectId: "landreportapp",
  storageBucket: "landreportapp.appspot.com",
  messagingSenderId: "743751569926",
  appId: "1:743751569926:web:a9d6d39872a6c20599e987",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { 
  auth, 
  db, 
  collection, 
  getDocs, 
  setDoc, 
  addDoc,
  doc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy,
  deleteDoc,
  updateDoc,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider
};