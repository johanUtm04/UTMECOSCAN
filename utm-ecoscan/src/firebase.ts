// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBt3zvwsVGjs0D2hM5JVwoxRUJgJaHKGd0",
  authDomain: "contaminacion-en-el-aire-utm.firebaseapp.com",
  projectId: "contaminacion-en-el-aire-utm",
  storageBucket: "contaminacion-en-el-aire-utm.firebasestorage.app",
  messagingSenderId: "486719268700",
  appId: "1:486719268700:web:c83bd86ad530eeb0100399"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
