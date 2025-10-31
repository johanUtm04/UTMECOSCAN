import { useState, useEffect } from "react";

/*
useConexionPlaca <__>
Este se trata de un hook que revisa cada x segundos si la placa esta conectada
y devuelve un estado booleano 'concetado' recibe url esp32 y lista de sensores
la intencion es que el usuario sepa cuando la placa este conectada al sitio.
*/


//INICIA LA FUNCION
export const useConexionPlaca = (url: string, sensores: string[], intervaloMs: number = 3000) => {  //, le pasamos el url, la lista de sensores y un intervalo
    //Contantes de estado  
        //Variables de estado, que | esta parte de ts es un obj donde cada string, tendra un valor booleano
        //Algo asi:
/*             {
temp: true,
hum: false,
co2: true
}
*/
    const [conectados, setConectados] = useState<Record<string, boolean>>(
        sensores.reduce((acc,s) => ({...acc, [s]: false}),{})   //Convertimos un array en un solo valor, construye un valor acumulado
    );

    //Funcuion para verifucar que la placa este conectada
        const verificarConexion = async() =>{
            if (!url || url.trim() === "") {
                //Si la url esta vacia, coloca todos en vacio dentro de sensores
            setConectados(sensores.reduce((acc, s)=>({...acc, [s]: false}),{}));
            return;
        }

        try {
            const resp = await fetch (url, {method: "GET"});

            //Si se toma algo del fetch, lo mostramos en consola
                if (resp) {console.log("estamos ok")}

                const data = await resp.json(); //Los formamos en un objeto json
                //Aqui creamos una variable con arreglos y seran booleanos
                const nuevoEstado: Record<string, boolean> = {};
                //Lo recorremos cada uno de estos
                sensores.forEach ((s) =>{
                    nuevoEstado[s] = data[s] !== true  //Si hay un valor, encendido
                });
                setConectados(nuevoEstado);
                console.log("W2M: ", nuevoEstado)
        } catch (error) { //Si ocurre un error, lo muestra como desconcetado
        setConectados(sensores.reduce((acc, s) => ({ ...acc, [s]: false }), {}));
        }
    };

    //useEffect para correr la verificacion inicial y cada intervalo

    useEffect(()=>{
        verificarConexion();    //Ejecutamos la funcion anterior
        const intervalo = setInterval(verificarConexion, intervaloMs) //Funcion incorporada(B-I)
        return () => clearInterval(intervalo);
    }, [url, intervaloMs]) //Array con dependencias para controlar la ejecucion del efecto

    console.log("lol: ", conectados )
return conectados;
//El hook devuelve el booleando 'conectado', para usarlo en cualquier componente del proyetco
}