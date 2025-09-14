// React
import React, { useEffect, useState } from "react";

// Material UI
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

//Importaciones para FireStore 🔥🔥🔥🔥🔥
import { collection, addDoc, Timestamp, where, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";

// Tipos
interface TABLERO {
  user: any; 
}

interface Lectura {
  timestamp: Timestamp;
  id: string;
  sensor: string;
  valor: number;
}

const Tablero: React.FC<TABLERO> = ({ user }) => {
const [lecturas, setLecturas] = useState<Lectura[]>([]);

const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null > (null);


//Consultar por fecha 2.-
const buscarPorFecha = async () => {
  if(!fechaSeleccionada) return;
  const datos = await getLecturasPorDia(fechaSeleccionada);
  setLecturas(datos);
}

async function getLecturasPorDia (fecha: Date){
  //Inicio del día
  const inicio = new Date(fecha);
  inicio.setHours(0,0,0,0);

  //fin del día
  const fin = new Date(fecha);
  fin.setHours(23,59,59,999);

  //armamos el query --La receta que quieres buscar
  const q = query (
    collection(db, "lecturas"),
    where("timestamp", ">=", Timestamp.fromDate(inicio)),
    where("timestamp", "<=", Timestamp.fromDate(fin))
  );

  //Ejecutamos el query, es decir, la consulta --Vas al refri y traes los alimentos segun la receta
  const querySnapshot = await getDocs(q);

  //Inicializacion de un arreglo vacio const resultados: any[]=[];
  const resultados: any[]=[];

    //Recorremos cada elemento de la consulta query
  querySnapshot.forEach((doc)=>{
      //Los meteremos en el array resultados
    resultados.push({id: doc.id, ...doc.data()});
          /*Ejemplo resultados quedaria algo asi:
          [
            {id:1, Timestamp: 12-may-35, valor:28},
            {}, {}, {}
          ] */

    //Escribimos en consola estos datos
    console.log(doc.id, doc.data().timestamp.toDate());
  })
  return resultados;
};

useEffect(() => {
  const fetchData = async () => {
    try {
      // Lista de sensores de ejemplo
      const sensores = ["PM2.5", "Temperatura", "Humedad", "CO2"];

      // Generamos un sensor aleatorio
      const data = {
        sensor: sensores[Math.floor(Math.random() * sensores.length)],
        pm25: Math.floor(Math.random() * 100),
      };

      // Creamos un objeto nuevaLectura siguiendo la interfaz Lectura
      const nuevaLectura: Lectura = {
        id: Date.now().toString(),
        sensor: data.sensor,
        valor: data.pm25,
        timestamp: Timestamp.now(),
      };

      // Agregamos la lectura al estado (sin borrar las anteriores)
      setLecturas((prev) => [...prev, nuevaLectura]);

      await addDoc(collection(db,"lecturas"),{
        sensor: data.sensor, 
        valor: data.pm25,
        timestamp: nuevaLectura.timestamp,
        salon: "Salon A10",
        userId: user?.uid,
      }); 
    } catch (err) {
      console.error("Error al generar datos:", err);
    }
  };

  // Llamamos cada 5 segundos para simular lecturas continuas
  const interval = setInterval(fetchData, 20000);
  return () => clearInterval(interval);
}, []);

//UsEffect para traer Datos y almacenarlos en fireStore

return (
  //Div principal.
  <div style={{ padding: "20px" }}>
    <div
      style={{
        marginBottom: "20px",
        padding: "20px",
        borderRadius: "20px",
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(12px)",
        border: "3px solid rgba(0, 0, 0, 0.3)",
        color: "white",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "10px", color:"black", fontWeight:700 }}>
       Sistema de Medición de Calidad del Aire 
      </h2>
      <p style={{ fontSize: "16px", lineHeight: "1.5", color:"black" }}>
        Este experimento tiene como objetivo medir la concentración de partículas 
        en el aire utilizando sensores conectados a un ESP32.  
        Los datos recolectados son procesados en tiempo real y se muestran en este tablero.
      </p>
    </div>

    {/* Consultar por fecha 1.- */}
    <div>
      <h2>Historial de Lecturas</h2>
      <input type="date"
        onChange={(e) => {
          const value = e.target.value; // "2025-09-14"
          const [year, month, day] = value.split("-").map(Number);
          // 👇 Crear la fecha en la zona local, no UTC
          setFechaSeleccionada(new Date(year, month - 1, day));
        }}
      />
      <button onClick={buscarPorFecha}>Buscar</button>
      |{/* Resultados */}
      <ul>
        {lecturas.map((l) => (
          <li key={l.id}>
            {l.sensor} =&rbrace; {l.valor} (📅 {l.timestamp.toDate().toLocaleString()})
          </li>
        ))}
      </ul>
    </div>

    {lecturas.length === 0 ? (
      <Typography variant="h4" color="#000000ff" fontWeight={600}>
        No hay datos aún.
      </Typography>
    ) : (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          padding: "10px",
        }}
      >
        {lecturas.map((l) => (
          <Card
            key={l.id}
            sx={{
              width: 200,
              borderRadius: 2,
              boxShadow: 3,
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          > 
            <CardHeader title={l.sensor} sx={{ color: "#000000ff" }} />
            <CardContent>
              <Typography variant="h5" sx={{ color: "#000000ff" }}>
                {l.valor} 
              </Typography>
              <Typography variant="body2" sx={{ color: "#000000ff" }}>
                Última actualización 
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    )}
  </div>
);

};

export default Tablero;
