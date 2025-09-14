// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider ,
signInWithPopup } from "firebase/auth";
import App from "./App";

const firebaseConfig = {
  apiKey: "AIzaSyBt3zvwsVGjs0D2hM5JVwoxRUJgJaHKGd0",
  authDomain: "contaminacion-en-el-aire-utm.firebaseapp.com",
  projectId: "contaminacion-en-el-aire-utm",
  storageBucket: "contaminacion-en-el-aire-utm.firebasestorage.app",
  messagingSenderId: "486719268700",
  appId: "1:486719268700:web:c83bd86ad530eeb0100399"
};

//Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GithubAuthProvider();


//Iniciar sesion con github
  //Funcion flecha Async para esperar un await
export const loginWithGitHub = async () => {
  try{
    const result = await signInWithPopup(auth, provider);
    const user = result.user

    //Token de gitub
    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    console.log("Token: ", token);

    return user;
  } catch(error: any){
    console.error("Error al inciar sesion con git, por lo siguiente: ", error)
  }
}



//Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
export {auth, googleProvider, facebookProvider, signInWithPopup, getFirestore};
export const db = getFirestore(app);