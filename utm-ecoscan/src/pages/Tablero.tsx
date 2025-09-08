// React
import React, { useEffect, useState } from "react";

// Material UI
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

// Firebase
import { db } from "../firebase";
import { collection, onSnapshot, query, where, orderBy, limit } from "firebase/firestore";

// Tipos
interface TABLERO {
  user: any; 
}

interface Lectura {
  id: string;
  sensor: string;
  valor: number;
}

const Tablero: React.FC<TABLERO> = ({ user }) => {
  const [lecturas, setLecturas] = useState<Lectura[]>([]);


   useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://192.168.1.97/json"); 
        const data = await res.json();
        // Adaptamos el JSON a tu interfaz Lectura[]
        const nuevaLectura: Lectura = {
          id: Date.now().toString(),
          sensor: data.sensor,
          valor: data.pm25, // ejemplo: mostrar PM2.5
        };
        setLecturas((prev) => [...prev, nuevaLectura]); // Agrega al historial
      } catch (err) {
        console.error("Error al obtener datos:", err);
      }
    };

    // Llamamos cada 5 segundos
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (lecturas.length === 0)
    return <Typography>No hay datos aún.</Typography>;

  return (
    <div>
      <h1>Lecturas del Sensor</h1>
      <ul>
        {lecturas.map((l) => (
          <li key={l.id}>
            {l.sensor}: {l.valor} 
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tablero;
