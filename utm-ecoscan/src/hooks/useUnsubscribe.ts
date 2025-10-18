import { useEffect, useState } from "react";
import { onUserStateChanged } from "../ui";

export function useAuthListener (){
    const [usuario, setUsuario] = useState<any>(null);
    const [loading, setLoading] = useState (true);

    useEffect (() => {
        const unsubscribe = onUserStateChanged((currentUser) =>{
            setUsuario(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    },[]);
    return {usuario, loading};
}