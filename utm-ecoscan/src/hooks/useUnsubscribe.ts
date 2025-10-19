import { useEffect, useState } from "react";    //Importacion efectos y estado--
import { onUserStateChanged } from "../ui";     //Funcion externa de firebase (funciona como AuthListener)--

export function useAuthListener (){
    const [usuario, setUsuario] = useState<any>(null);
    const [loading, setLoading] = useState (true);

    useEffect (() => {
        //Funcion callback. Lee al usuario y altera estos valores en las variable de estado--
        const unsubscribe = onUserStateChanged((currentUser) =>{
            setUsuario(currentUser);
            setLoading(false);
        });
        //Abandona el efecto una ves sucede--
        return () => unsubscribe();
    },[]);
    //Devuelve las variables de estado--
    return {usuario, loading};
}