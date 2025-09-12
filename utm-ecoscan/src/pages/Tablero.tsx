// React
import React, { useEffect, useState } from "react";

// Material UI
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import {motion} from "framer-motion";


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
      // Lista de sensores de ejemplo
      const sensores = ["PM2.5", "Temperatura", "Humedad", "CO2"];

      // Generamos un sensor aleatorio
      const data = {
        sensor: sensores[Math.floor(Math.random() * sensores.length)],
        pm25: Math.floor(Math.random() * 100), // valor aleatorio entre 0-99
      };

      // Creamos un objeto nuevaLectura siguiendo la interfaz Lectura
      const nuevaLectura: Lectura = {
        id: Date.now().toString(), // id único
        sensor: data.sensor,
        valor: data.pm25,
      };

      // Agregamos la lectura al estado (sin borrar las anteriores)
      setLecturas((prev) => [...prev, nuevaLectura]);

    } catch (err) {
      console.error("Error al generar datos:", err);
    }
  };

  // Llamamos cada 5 segundos para simular lecturas continuas
  const interval = setInterval(fetchData, 8000);
  return () => clearInterval(interval);
}, []);





return (
  <div style={{ padding: "20px" }}>
    {/* 📌 Presentación siempre visible */}
    <div
      style={{
        marginBottom: "20px",
        padding: "20px",
        borderRadius: "20px",
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.3)",
        color: "white",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "10px", color:"black" }}>
        Experimento: Sistema de Medición de Calidad del Aire 🌍
      </h2>
      <p style={{ fontSize: "16px", lineHeight: "1.5", color:"black" }}>
        Este experimento tiene como objetivo medir la concentración de partículas 
        en el aire utilizando sensores conectados a un ESP32.  
        Los datos recolectados son procesados en tiempo real y se muestran en este tablero.
      </p>
    </div>

    {/* 📊 Aquí el tablero dinámico */}
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
