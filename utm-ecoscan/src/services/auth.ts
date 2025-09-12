// src/services/auth.ts
import { auth, googleProvider, facebookProvider, signInWithPopup } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
  onAuthStateChanged, //Aqui llamamos una funcion tipo unsubscribe
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

//LISTENER -- USUARIO EN BD
/* ❗❓ No olvidemos que "export" es que pueda ser usada desde otras partes del codigo*/
/* ✍ llamarDeVuelta== aquí, esperamos un parametro llamado user o es user | es vacio
y no devuelve nada "=>void" */
/* ✍ Mi funcion "onUserStateChanged" va a recibir un parametro llamarDeVuelta, que se ejecuta cada que hay un usuario logeado(User) o deslogeado(null)
es una funcion que recibe otra funcion*/
export const onUserStateChanged = (callback: (user: User | null) => void) => {
  //✍llamamos "onAuthStateChanged" de firebase, y le pasamos auth y la funcion "llamarDeVuelta".
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

