// IMPORTACIONES --
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { collection, addDoc, Timestamp, where, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import "./Tablero.css"
import logoUtm from "../assets/imgs/UTM.png";
import GraficaSensor from "../components/GraficaSensor";
import { Snackbar, Alert } from "@mui/material";
import { SENSORES, INTERVALO_LM5, API_URL } from "../constantes";
import { checkThreshold } from "../utils/checkThreshold";
import { pushNotificationForUser } from "../utils/notifications";

//Interface(s): Sirve para definir la forma de un objeto
interface TABLERO {
  user: any; 
}
interface Lectura {
  timestamp: Timestamp;
  id: string;
  sensor: string;
  valor: number;
}
interface SnackbarState  {
open: boolean;
message: string;
severity: 'error' | 'info' | 'success' | 'warning';
};

//Inicio de Componente
function Tablero({user}: TABLERO){
//Constantes
const [sensorActivo, setSensorActivo] = useState("");
const [lecturas, setLecturas] = useState<Lectura[]>([]);
const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null > (null);
const lecturasFiltradas = lecturas.filter((l) => l.sensor === sensorActivo);
const [snackbar2, setSnackbar2] = useState<SnackbarState>({
  open: false,
  message: "",
  severity: "warning",
});
const showSnackbar2 = (message: string, severity: SnackbarSeverity) => {
  setSnackbar2({ open: true, message, severity});
};
const [,setSnackbarOpen] = useState(false);
const [,setSnackbarMessage] = useState("");
const showSnackbar = (message: string) =>{
  setSnackbarMessage(message);
  setSnackbarOpen(true);
}
const buscarPorFecha = async () => {
  if(!fechaSeleccionada) return;
  const datos = await getLecturasPorDia(fechaSeleccionada);
  setLecturas(datos);
}
let intervalId: NodeJS.Timeout;


//Types: Sirve para definir alias de tipos(strings literales, uniones, tuplas)
type SnackbarSeverity = 'success' | 'error' | 'info' | 'warning';

//Funcion asincrona
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

//Inicio de useEffect:es un hook de React que sirve para ejecutar código “secundario” o “efectos” después de que el componente se renderiza
useEffect(() => {
  //🐬Condicion del tipo de sensor que utilize el usuario
  const iniciarLectura = () => {
    //Lectura simulada
    if (sensorActivo === SENSORES.SIMULACION) {
      intervalId = setInterval(async () => {
        const sensores = [SENSORES.CO2, SENSORES.TEMPERATURA, SENSORES.PM25];
        const dataSimulada = {
        sensor: sensores[Math.floor(Math.random() * sensores.length)],
        valor: Math.floor(Math.random() * 10000),
        };
        const nuevaLectura: Lectura = {
        timestamp: Timestamp.now(),
        id: Date.now().toString(),
        sensor: dataSimulada.sensor,
        valor: dataSimulada.valor,
        };
        //🐬Concatenar lecturas 
        setLecturas((estadoAnterior) => [...estadoAnterior, nuevaLectura]);
        const resultado = checkThreshold(nuevaLectura.sensor, nuevaLectura.valor);
        if (resultado.level !== "ok") {
        await pushNotificationForUser(user.uid, {
        sensor: nuevaLectura.sensor,
        message: resultado.message,
        level: resultado.level,
        value: nuevaLectura.valor
        });
      }
      }, INTERVALO_LM5);
    }

    else if (sensorActivo === SENSORES.PM25) {
      intervalId = setInterval(async () => {
        console.log("leyendo sensor de partículas (PM2.5)...");
        const res = await fetch(API_URL);
        const data = await res.json();
        const nuevaLectura: Lectura = {
        timestamp: Timestamp.now(),
        id: Date.now().toString(),
        sensor: data.sensor,
        valor: data.pm25,
        };
        setLecturas((prev) => [...prev, nuevaLectura]);
        await addDoc(collection(db, "Lecturas del PM2.5"), {
        sensor: data.sensor,
        valor: data.pm25,
        timestamp: nuevaLectura.timestamp,
        salon: "Salon A10",
        userId: user?.uid,
        });
      }, INTERVALO_LM5);
    }

    else if (sensorActivo === SENSORES.TEMPERATURA) {
      intervalId = setInterval(async () => {
        console.log("leyendo sensor de Temperatura...");
        const conexion = await fetch(API_URL);
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
      }, INTERVALO_LM5);
    }
  };
  iniciarLectura();
  return () => {
    if (intervalId) clearInterval(intervalId);
    console.log("Se limpió el sensor anterior");
  };
}, [sensorActivo, user]);


return (
  //Div principal: 
  <div style={{ padding: "20px", border:"4px solid red"}}>
    {/* Div de mensaja de bienvenida */}
    <div className="msj-welcome-container">
      <h2 style={{fontWeight:700, textAlign:"center" }}>
      Sistema de Medición de Calidad del Aire 
      </h2>
      <p style={{ fontSize: "16px",color:"white", }}>
        Este experimento tiene como objetivo medir la concentración de partículas 
        en el aire utilizando sensores conectados a un ESP32. 
        Se Realizo con la intencion de medir la calidad del aire en ciertas parte
        de la Univesidad Tecnologica de Morelia {" "}
        <img src={logoUtm} alt="Logo de la Utm"  className="logoUtm"
        style={{width: "80px", height:"25px", verticalAlign: "middle", margin:" 0 5px", border: "2px solid red"}}  
        onClick={() => window.open("https://ut-morelia.edu.mx/", "_blank")} />
        Los datos recolectados son procesados en tiempo real y se muestran en este tablero.
      </p>
    </div>
    {/* Consultar por fecha 1.- */}
    <div style={{border:"border 2px solid green"}}>
      <div
      style={{
        borderRadius: "10px",
        border: "3px solid black",
        color: "#ffffffff",
        textAlign: "center",
      }}
      >
      <h2> Historial de Lecturas</h2>
      <div style={{justifyContent:"center", display:"flex", gap:"10px",
      marginBottom:"20px"}}>
      <button className="buttonPM" onClick={()=> {
        console.log("Boton de Johan Presionado")
        setSensorActivo(SENSORES.PM25)}}>PM2.5</button>
      <button className="buttonCO2" onClick={()=>{
        console.log("Boton de Axel Antonio Presionado")
        setSensorActivo(SENSORES.CO2)}}>CO2</button>
      <button className="buttonTemp" onClick={()=>{
        console.log("Boton de Axel Gabriel Presionado")
        setSensorActivo(SENSORES.TEMPERATURA)}}>Temperatura</button>
      <button className="buttonPruebas" onClick={()=>{
      showSnackbar2("Leyendo Pruebas", "warning");
        console.log("Se activaron las Lecturas de Prueba")
        setSensorActivo(SENSORES.SIMULACION)}}>
        Boton Para lectura de Prueba</button>
      <button className="buttonStop" onClick={() => {
        setSensorActivo(""), showSnackbar("-Deteniendo Simulaciones-")}}>
        Detener Lecturas</button>
      </div>
      </div>
      <input type="date"
        className="date-input"
        onChange={(e) => {
          const value = e.target.value; // "2025-09-14"
          const [year, month, day] = value.split("-").map(Number);
          // Crear la fecha en la zona local, no UTC
          setFechaSeleccionada(new Date(year, month - 1, day));
        }}
      />
      <button className="button-search" onClick={buscarPorFecha}>Buscar
      </button>
      {/* Resultados --Historial de lecturas */}
      <div
      style={{
        // Efecto de desenfoque bonito
        border: "2px solid black",                // Borde negro
        borderRadius: "12px",                     // Bordes redondeados
        padding: "1rem",                          // Espacio interno
        maxHeight: "250px",                       // Altura máxima de la tabla
        overflowY: "auto"                         // Si hay muchos datos, aparece scroll
      }}
      >
        {/* Titulo de arriba */}
      <h3 style={{marginBottom:"0.5 rem"}}>Historial de Lecturas</h3>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      {/* Encabezado de la tabla */}
      <thead>
        <tr style={{ background: "rgb(0,0,0,0.1)" }}>
          <th style={{ textAlign: "left", padding: "8px" }}>Sensor</th>
          <th style={{ textAlign: "left", padding: "8px" }}>Valor</th>
          <th style={{ textAlign: "left", padding: "8px" }}>Fecha</th>
          <th style={{ textAlign: "left", padding: "8px" }}>Calidad</th>
        </tr>
      </thead>

  {/* Cuerpo de la tabla (Filas de Datos) */}
  <tbody>
    {lecturas.map((l) => {
      const valor = l.valor;
      let estado = "";
      let color = "";

      //Constante para intercambiar la unidad de medida
      const unidad = (sensor:string) =>{
        if (sensor === SENSORES.PM25 || sensor===SENSORES.PM10) return "µg/m³";
        if (sensor === SENSORES.TEMPERATURA) return "ppm";
        if (sensor === SENSORES.CO2) return "°C";
        return "";
      }
      // Rango de mensajes y colores para PM2.5--
      if (l.sensor === SENSORES.PM25) {
        if (valor <= 12) { estado = "Bueno "; color = "green"; }
        else if (valor <= 35) { estado = "Aceptable "; color = "yellow"; }
        else if (valor <= 55) { estado = "Dañino "; color = "orange"; }
        else if (valor <= 150) { estado = "Peligroso "; color = "red"; }
        else { estado = "Muy peligroso "; color = "darkred"; }
      }

      // Rango para PM10
      if (l.sensor === SENSORES.PM10) {
        if (valor <= 50) { estado = "Bueno"; color = "green"; }
        else if (valor <= 100) { estado = "Aceptable "; color = "yellow"; }
        else if (valor <= 250) { estado = "Dañino "; color = "orange"; }
        else if (valor <= 350) { estado = "Peligroso "; color = "red"; }
        else { estado = "Muy peligroso ☠️"; color = "darkred"; }
      }

      // Rango para CO₂
      if (l.sensor === SENSORES.CO2) {
        if (valor <= 600) { estado = "Bueno"; color = "green"; }
        else if (valor <= 1000) { estado = "Aceptable"; color = "yellow"; }
        else if (valor <= 1500) { estado = "Malo"; color = "orange"; }
        else if (valor <= 2000) { estado = "Peligroso "; color = "red"; }
        else { estado = "Muy peligroso ☠️"; color = "darkred"; }
      }

    // Rango para Temperatura
    if (l.sensor === SENSORES.TEMPERATURA) {
      if (valor >= 18 && valor <= 24) { estado = "Confort"; color = "green"; }
      else if ((valor >= 15 && valor < 18) || (valor > 24 && valor <= 27)) { estado = "Aceptable"; color = "yellow"; }
      else if ((valor < 15 && valor >= 0) || (valor > 27 && valor <= 30)) { estado = "Incómodo"; color = "orange"; }
      else if (valor > 30) { estado = "Peligroso "; color = "red"; }
      else { estado = "Valor atípico"; color = "gray"; }
    }

      return (
        <tr key={l.id} style={{ borderBottom: "1px solid black" }}>
          <td style={{ padding: "8px" }}>{l.sensor}</td>
          <td style={{ padding: "8px" }}>{valor} {unidad(l.sensor)} </td>
          <td style={{ padding: "8px" }}>{l.timestamp.toDate().toLocaleString()}</td>
          <td style={{ padding: "8px", fontWeight: "bold", color }}>{estado}</td>
        </tr>
      );
    })}
  </tbody>
</table>
      </div>
    </div>
    {lecturas.length === 0 ? (
      <Typography variant="h4" color="#ffffffff" fontWeight={600}>
        No hay datos aún.
      </Typography>
    ) : /* en caso de que SI hay datos mostrar esto: */ (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", padding: "10px",}}>
        {lecturasFiltradas.map((l) => (
          /* Grafica */
          <Card
            key={l.id}
            sx={{
              width: 200,
              borderRadius: 2,
              boxShadow: 3,
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
            <CardHeader title={l.sensor} sx={{ color: "#ff0000ff" }} />
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
    <Snackbar
    open={snackbar2.open}
    autoHideDuration={3000}
    onClose={() => setSnackbar2({ ...snackbar2, open: false })}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
    <Alert
    onClose={() => setSnackbar2({ ...snackbar2, open: false })}
    severity={snackbar2.severity}
    sx={{ width: '100%' }}
    >
    {snackbar2.message}
    </Alert>
    </Snackbar>
  </div>
  
);

};

export default Tablero;
