import {useState, Typography, GraficaSensor, Snackbar, Alert, useEffect} from "../ui";  //Importacion componentes--
import "./Tablero.css" //Importacion de Hoja de estilos--
import type {  TABLERO, SnackbarState} from "../ui";//Importacion de interfaces (type)--
import {logoUniversidad} from "../assets/index";
import { COLORES, SENSORES,} from "../constantes";
import { useLecturas } from "../hooks/useLecturas";
import {useConexionPlaca} from "../hooks/useConexionPlaca.ts"


//Inicio de Componente--
function Tablero({user}: TABLERO){
//Constantes--
  const [sensorActivo, setSensorActivo] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const { lecturas, buscarPorFecha } = useLecturas(user, sensorActivo, fechaSeleccionada);
  const sensoresDisponibles = [SENSORES.PM25, SENSORES.TEMPERATURA]; // los que realmente tienes

  const conectados = useConexionPlaca("http://192.168.1.97/data-json", sensoresDisponibles);
  const [detalleAbierto, setDetalleAbierto] = useState(false);
  const [lecturaSeleccionada, setLecturaSeleccionada] = useState<any | null>(null);

  // Funciones para abrir/cerrar modal
  const abrirModal = (lectura: any) => {
    setLecturaSeleccionada(lectura);
    setDetalleAbierto(true);
  };
  const cerrarModal = () => {
    setDetalleAbierto(false);
    setLecturaSeleccionada(null);
  };
useEffect(() => {
  const intervalId = setInterval(() => {
  }, 5000);
  return () => {
    clearInterval(intervalId);
  };
}, []);

//const lecturasFiltradas = lecturas.filter((l) => l.sensor === sensorActivo);
const [snackbar2, setSnackbar2] = useState<SnackbarState>({
  open: false,
  message: "",
  severity: "warning",
});
const showSnackbar2 = (message: string, severity: SnackbarSeverity, customColor?: string ) => {
  setSnackbar2({ open: true, message, severity, customColor});
};
const [,setSnackbarOpen] = useState(false);
const [,setSnackbarMessage] = useState("");
const showSnackbar = (message: string) =>{
  setSnackbarMessage(message);
  setSnackbarOpen(true);
}


//Types: Sirve para definir alias de tipos(strings literales, uniones, tuplas)
type SnackbarSeverity = 'success' | 'error' | 'info' | 'warning';
return (
  //Div principal: 
  <div style={{ padding: "20px"}}>
    {/* Div de mensaja de bienvenida */}
    <div className="msj-welcome-container">
      <div style={{display:"flex", justifyContent: "center"}}>

      <h1>Bienvenido</h1>
      <button className="buttonReset" onClick={() => {
      recargarPagina()
      }}>
      <span className="button__text">Recargar</span>
      <span className="button__icon"><svg className="svg" height="48" viewBox="0 0 48 48" width="8" 
      xmlns="http://www.w3.org/2000/svg">
      <path d="M35.3 12.7c-2.89-2.9-6.88-4.7-11.3-4.7-8.84 0-15.98 7.16-15.98 16s7.14 16 15.98 
      16c7.45 0 13.69-5.1 15.46-12h-4.16c-1.65 4.66-6.07 8-11.3 8-6.63 0-12-5.37-12-12s5.37-12 
      12-12c3.31 0 6.28 1.38 8.45 3.55l-6.45 6.45h14v-14l-4.7 4.7z">
      </path><path d="M0 0h48v48h-48z" fill="none"></path></svg></span>
      </button>
      </div>
      
      <p style={{ fontSize: "16px",color:"white", }}>
        Los datos recolectados son procesados en tiempo real y se muestran en este tablero.
        Este experimento tiene como objetivo medir la concentración de partículas 
        en el aire utilizando sensores conectados a un ESP32. 
        Se Realizo con la intencion de medir la calidad del aire en ciertas parte
        de la Univesidad Tecnologica de Morelia {" "}
        <img src={logoUniversidad} alt="Logo de la Utm"  className="logoUtm"
        style={{width: "80px", height:"25px", verticalAlign: "middle", margin:" 0 5px"}}  
        onClick={() => window.open("https://ut-morelia.edu.mx/", "_blank")} />
      </p>
    </div>
    {/* Consultar por fecha 1.- */}
    <div>
      <div
      style={{
        borderRadius: "10px",
        color: "#ffffffff",
        textAlign: "center",
        marginBottom:"10px"
      }}
      >
      <div className="linea-azul ">
      <h2 style={{color: COLORES.blanco, marginTop:"10px"}}> Elige entre nuestros 3 sensores disponibles</h2>
      </div>
      <div style={{justifyContent:"center", display:"flex", gap:"10px",
      marginBottom:"10px"  , borderBottom: "2px solid" + COLORES.utm, borderRadius: "10px", paddingBottom: "10px"}}>
        
      <button className="botonPM" onClick={() => {
        showSnackbar2("Leyendo Partículas 2.5", "info", "#1de4f7" );  // tipo informativo
        setSensorActivo(SENSORES.PM25);
      }}>
        PM2.5
        <span className={`bombilla ${conectados[`${SENSORES.PM25}`] ? "encendida" : "apagada"}`}>🔆</span>
      </button>
      <button className="botonCo2" onClick={() => {
        showSnackbar2("Leyendo Oxígeno", "info", "#4CAF50"); // tipo éxito
      }}>
        CO2
        <span className={`bombilla ${conectados[`${SENSORES.CO2}`] ? "encendida" : "apagada"}`}>🔆</span>
      </button>
     <button className="botonTemperatura" onClick={() => {
        showSnackbar2("Leyendo Temperatura", "info", "#FF5722"); // color principal
        setSensorActivo(SENSORES.TEMPERATURA);
      }}>
        Temperatura
        <span className={`bombilla ${conectados[`${SENSORES.TEMPERATURA}`] ? "encendida" : "apagada"}`}>🔆</span>
      </button> 


<button className="botonPruebas" onClick={() => {
        showSnackbar2("Leyendo Pruebas de Simulación","info", "#ff00d4"); 
        setSensorActivo(SENSORES.SIMULACION);
      }}>
        Lecturas de Prueba
      </button> 
<button className="buttonStop" onClick={() => {
  setSensorActivo("");
  showSnackbar("-Deteniendo Simulaciones-"); 
}}>
  Detener Lecturas
</button>

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
      <button className="button-search" onClick={buscarPorFecha}
      >Filtrar
      </button>
      {/* Resultados --Historial de lecturas */}
      <div
      style={{
        borderRadius: "12px",                     // Bordes redondeados
        padding: "1rem",                          // Espacio interno
        maxHeight: "250px",                       // Altura máxima de la tabla
        overflowY: "auto"                         // Si hay muchos datos, aparece scroll
      }}
      >
        {/* Titulo de arriba */}
      <h3 style={{marginBottom:"0.2 rem", color: "white"}}>Historial de Lecturas</h3>
      <div className="tabla-historial-container">

    <table className="tabla-historial">
      {/* Encabezado de la tabla */}
      <thead>
        <tr style={{ background: "#1de4f7", color: "black" }}>
          <th style={{ textAlign: "left", padding: "12px", fontWeight: "600" }}>Sensor</th>
          <th style={{ textAlign: "left", padding: "12px", fontWeight: "600" }}>Valor</th>
          <th style={{ textAlign: "left", padding: "12px", fontWeight: "600" }}>Fecha</th>
          <th style={{ textAlign: "left", padding: "12px", fontWeight: "600" }}>Calidad</th>
          <th style={{ textAlign: "left", padding: "12px", fontWeight: "600" }}>detalles</th>
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
        else { estado = "Muy peligroso "; color = "darkred"; }
      }

      // Rango para CO₂
      if (l.sensor === SENSORES.CO2) {
        if (valor <= 600) { estado = "Bueno"; color = "green"; }
        else if (valor <= 1000) { estado = "Aceptable"; color = "yellow"; }
        else if (valor <= 1500) { estado = "Malo"; color = "orange"; }
        else if (valor <= 2000) { estado = "Peligroso "; color = "red"; }
        else { estado = "Muy peligroso "; color = "darkred"; }
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
        <tr key={l.id} data-sensor={l.sensor} style={{ borderBottom: "1px solid black", background: "#faf9f6"}}>
          <td style={{ padding: "8px" }}>{l.sensor}</td>
          <td style={{ padding: "8px" }}>{valor} {unidad(l.sensor)} </td>
          <td style={{ padding: "8px" }}>{l.timestamp.toDate().toLocaleString()}</td>
          <td style={{ padding: "8px", fontWeight: "bold", color }}>{estado}</td>
          <td style={{ padding: "8px" }}>
            <button
              onClick={() => abrirModal(l)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Ver detalles
            </button>
          </td>

        </tr>
      );
    })}
  </tbody>
</table>
</div>

      </div>
    </div>

{lecturas.length === 0 ? (
  <Typography variant="h4" color="#ffffffff" fontWeight={600}>
    No hay datos aún.
  </Typography>
) : (
  <div>
    {/* Aquí NO pintamos las gráficas ni tarjetas automáticamente */}
    {/* Solo dejamos que se muestren los datos en la tabla */}
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
    sx={{
      width: "100%",
      color: snackbar2.customColor || "#ff00d4",
      border: "1px solid" + snackbar2.customColor || "#ff00d4",
      "& .MuiAlert-icon": { color: snackbar2.customColor || "white" },
    }}
    >
    {snackbar2.message}
    </Alert>
    </Snackbar>
<br />
{detalleAbierto && lecturaSeleccionada && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-lg relative">

      {/* Botón de cerrar */}
      <button
        onClick={cerrarModal}
        className="absolute top-3 right-3 text-gray-600 hover:text-black"
      >
        ✖
      </button>

      {/* Contenido del modal */}
      <h2 className="text-2xl font-semibold mb-4 text-center text-green-700">
        Detalles de la Lectura
      </h2>

      <p><strong>Sensor:</strong> {lecturaSeleccionada.sensor}</p>
      <p><strong>Valor:</strong> {lecturaSeleccionada.valor}</p>
      <p><strong>Fecha:</strong> {lecturaSeleccionada.timestamp.toDate().toLocaleString()}</p>
      <p><strong>ID:</strong> {lecturaSeleccionada.id}</p>
 
      <div className="mt-4 flex justify-center">
        <GraficaSensor
          datos={[{
            timestamp: lecturaSeleccionada.timestamp.toDate(),
            valor: lecturaSeleccionada.valor
          }]}
          sensor={lecturaSeleccionada.sensor}
        />
      </div> 

    </div>
  </div>
)}

  </div>
  
);
function recargarPagina(): void {
  window.location.reload();
}

// Llamar a la función para recargar la página
recargarPagina();

};

export default Tablero;
