// src/services/auth.ts
import { auth, googleProvider, facebookProvider, signInWithPopup } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
  onAuthStateChanged,
} from "firebase/auth";


export const register = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const login = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return signOut(auth);
};

export const onUserStateChanged = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};


// Login con Google (Llamamos Venta de Google para inisiar sesion)
export const loginWithGoogle = async () =>{
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

//Login con facebook
export const loginWithFacebook = async () => {
  const result = await signInWithPopup(auth, facebookProvider);
  return result.user;
};

