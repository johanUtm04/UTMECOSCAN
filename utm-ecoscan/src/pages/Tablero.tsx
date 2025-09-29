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
import "./Tablero.css"

//Importaciones de imagenes 
import logoUtm from "../assets/UTM.png"

//Importaciones de Componentes --Reutilizables
import GraficaSensor from "../components/GraficaSensor";


// Tipos
interface TABLERO {
  user: any; 
}

//Molde del como debe de lucir el objeto de lecturas
interface Lectura {
  timestamp: Timestamp;
  id: string;
  sensor: string;
  valor: number;
}

const Tablero: React.FC<TABLERO> = ({ user }) => {
const [sensorActivo, setSensorActivo] = useState("");
const [lecturas, setLecturas] = useState<Lectura[]>([]);
const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null > (null);
const lecturasFiltradas = lecturas.filter((l) => l.sensor === sensorActivo);

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
//Use Effect Con 4 posibilidades
/* 1.-Boton de Simulacion, en caso de no tener un Sensor Conectado
2.-useEffect para particulas pm2.5 (johan)
3.-useEffect para C02 (Axel Antonio)
4.-useEffect para temperatura(Axel Gabo) */

useEffect(() => {
  if (!sensorActivo) {
    console.log("el sensor está vacío, no voy a hacer nada 🚫");
    return;
  }

  let intervalId: NodeJS.Timeout;

  const iniciarLectura = () => {
    if (sensorActivo === "simulacion") {
      intervalId = setInterval(async () => {
        console.log("📡 leyendo Datos Simulados...");

        const sensores = ["PM2.5", "Temperatura", "CO2"];
        const dataSimulada = {
          sensor: sensores[Math.floor(Math.random() * sensores.length)],
          valor: Math.floor(Math.random() * 100),
        };

        const nuevaLectura: Lectura = {
          timestamp: Timestamp.now(),
          id: Date.now().toString(),
          sensor: dataSimulada.sensor,
          valor: dataSimulada.valor,
        };

        setLecturas((estadoAnterior) => [...estadoAnterior, nuevaLectura]);

        await addDoc(collection(db, "lecturas-Fake"), {
          sensor: dataSimulada.sensor,
          valor: dataSimulada.valor,
          timestamp: nuevaLectura.timestamp,
          salon: "Aula 1",
          userId: user?.uid,
        });
      }, 2000);
    }

    else if (sensorActivo === "PM2.5") {
      intervalId = setInterval(async () => {
        console.log("📡 leyendo sensor de partículas (PM2.5)...");

        const res = await fetch("http://192.168.1.97/data-json");
        const data = await res.json();

        const nuevaLectura: Lectura = {
          timestamp: Timestamp.now(),
          id: Date.now().toString(),
          sensor: data.sensor,
          valor: data.pm25,
        };

        setLecturas((prev) => [...prev, nuevaLectura]);

        await addDoc(collection(db, "lecturas del PM2.5"), {
          sensor: data.sensor,
          valor: data.pm25,
          timestamp: nuevaLectura.timestamp,
          salon: "Salon A10",
          userId: user?.uid,
        });
      }, 2000);
    }

    else if (sensorActivo === "Temperatura") {
      intervalId = setInterval(async () => {
        console.log("📡 leyendo sensor de Temperatura...");

        const conexion = await fetch("http://192.168.1.97/data-json");
        const dataBM280 = await conexion.json();

        const nuevaLecturaBM280: Lectura = {
          timestamp: Timestamp.now(),
          id: Date.now().toString(),
          sensor: dataBM280.sensor,
          valor: dataBM280.temperature,
        };

        setLecturas((prev) => [...prev, nuevaLecturaBM280]);

        await addDoc(collection(db, "Lecturas del BM280"), {
          sensor: dataBM280.sensor,
          valor: dataBM280.temperature,
          timestamp: nuevaLecturaBM280.timestamp,
          Lugar: "Morelia",
          userId: user?.uid,
        });
      }, 2000);
    }
  };

  // 👇 Se llama la función
  iniciarLectura();

  // 🔥 Limpiar cuando cambie de sensor
  return () => {
    if (intervalId) clearInterval(intervalId);
    console.log("Se limpió el sensor anterior ✅");
  };
}, [sensorActivo, user]);



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
        border: "3px solid black",
        color: "white",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "10px", color:"white", fontWeight:700 }}>Sistema de Medición de Calidad del Aire 
      </h2>
      <p style={{ fontSize: "16px", lineHeight: "1.5", color:"white", }}>
        Este experimento tiene como objetivo medir la concentración de partículas 
        en el aire utilizando sensores conectados a un ESP32. Se Realizo con la intencion de medir la calidad del aire en ciertas parte
        de la Univesidad Tecnologica de Morelia {" "}
        <img src={logoUtm}alt="Logo de la Utm"
        style={{width: "50px", /* ancho */ height:"25px", /* alto */ verticalAlign: "middle", /* alineacion Vertical  */margin:" 0 5px" /* le da respiracion al texto */}} />
        Los datos recolectados son procesados en tiempo real y se muestran en este tablero.
      </p>
    </div>

    {/* Consultar por fecha 1.- */}
    <div>
      <div
      style={{
        borderRadius: "10px",
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(12px)",
        border: "3px solid black",
        color: "#ffffffff",
        textAlign: "center",
      }}
      >
      <h2> Historial de Lecturas</h2>
      <div style={{justifyContent:"center", display:"flex", /* para que sea flexible */ gap:"10px", /* espacio entre los elementos  */marginBottom:"20px" /* margen inferior */}}>
      <button className="buttonPM" onClick={()=> {
        console.log("Boton de Johan Presionado")
        setSensorActivo("PM2.5")}}>PM2.5</button>
      <button className="buttonCO2" onClick={()=>{
        console.log("Boton de Axel Antonio Presionado")
        setSensorActivo("CO2")}}>CO2</button>
      <button className="buttonTemp" onClick={()=>{
        console.log("Boton de Axel Gabriel Presionado")
        setSensorActivo("Temperatura")}}>Temperatura</button>
      <button className="buttonPruebas" onClick={()=>{
        console.log("Se activaron las Lecturas de Prueba")
        setSensorActivo("simulacion")}}>Boton Para lectura de Prueba</button>
      </div>
      </div>
      <input type="date"
        className="date-input"
        onChange={(e) => {
          const value = e.target.value; // "2025-09-14"
          const [year, month, day] = value.split("-").map(Number);
          // 👇 Crear la fecha en la zona local, no UTC
          setFechaSeleccionada(new Date(year, month - 1, day));
        }}
      />
      <button className="button-search" onClick={buscarPorFecha}>Buscar
      </button>
      |{/* Resultados */}
      <ul
      style={{
        backdropFilter: "blur(10px)",
        border: "3px solid black",
        borderRadius: "10px",
        fontWeight: 750,
        color: "black"
      }}
      >
        {lecturas.map((l) => (
          <li key={l.id}>
            {l.sensor} → {l.valor} ({l.timestamp.toDate().toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
    {/* En casi de no haber lecturas mostrar este mensaje */}
    {lecturas.length === 0 ? (
      <Typography variant="h4" color="#ffffffff" fontWeight={600}>
        No hay datos aún.
      </Typography>
    ) : /* en caso de que SI hay datos mostrar esto: */ (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", padding: "10px",}}>
        {/* Inicio de Expresion JavaScript 🟨⬛*/}
        {lecturasFiltradas.map((l) => (
          /* Grafica */
          <Card
            key={l.id}
            sx={{
              width: 200,
              borderRadius: 2,
              boxShadow: 3,
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              border: "1px solid black",
            }}
          > 
          <div style={{marginTop:"20px", background:"white", padding: "10px", borderRadius: "10px"}}>
          <h3 style={{textAlign:"center",}}> {sensorActivo} - Evolucion</h3>
          <GraficaSensor
            datos={lecturasFiltradas.map(l => ({
              timestamp: l.timestamp.toDate(), 
              valor: l.valor
            }))}
            sensor={sensorActivo}
          />
          </div>
            <CardHeader title={l.sensor} sx={{ color: "#000000ff" }} />
            <CardContent>
              <Typography variant="h5" sx={{ color: "#000000ff" }}>
                {l.valor ?? "Sin Valor registrado"} 
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
