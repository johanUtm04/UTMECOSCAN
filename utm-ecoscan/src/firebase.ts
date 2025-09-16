/* Importaciones ----- 🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢*/
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider,
signInWithPopup,} from "firebase/auth";
/* Importaciones ----- 🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢*/

//Conexion con firebase🟢
const firebaseConfig = {
  apiKey: "AIzaSyBt3zvwsVGjs0D2hM5JVwoxRUJgJaHKGd0",
  authDomain: "contaminacion-en-el-aire-utm.firebaseapp.com",
  projectId: "contaminacion-en-el-aire-utm",
  storageBucket: "contaminacion-en-el-aire-utm.firebasestorage.app",
  messagingSenderId: "486719268700",
  appId: "1:486719268700:web:c83bd86ad530eeb0100399"
};

//Inicializar Firebase🟢
  const app = initializeApp(firebaseConfig);
//{initializeApp} es la funcion encargada de arrancar firebase, dentro, ´firebaseConfig´ es la configuracion que yo le asigne

//Inicializar Autenticacion🟢
  const auth = getAuth(app);
//{getAuth} es la funcion encargada de obtener el modulo de autenticacion, ´app´ es la constante que acabo de iniciar y le pido un modulo para
//mi app

//Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
export {auth, googleProvider, facebookProvider, signInWithPopup, getFirestore};
export const db = getFirestore(app);