import { useEffect } from "react";

//Funcion para precargar imgs
export function usePreloadImages (images:string[]){
    useEffect (()=>{
        images.forEach((src)=>{
            const img = new Image ();
            img.src = src;
        })
    },[images]);
}