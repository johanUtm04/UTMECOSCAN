import {useState, Typography,Card, CardContent, CardHeader, GraficaSensor, Snackbar, Alert} from "../ui";  //Importacion componentes--
import "./Tablero.css" //Importacion de Hoja de estilos--
import type {  TABLERO, SnackbarState, Lectura} from "../ui";//Importacion de interfaces (type)--
import {logoUniversidad} from "../assets/index";
import { COLORES, SENSORES,} from "../constantes";
import { useLecturas } from "../hooks/useLecturas";


//Inicio de Componente--
function Tablero({user}: TABLERO){
//Constantes--
  const [sensorActivo, setSensorActivo] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const { lecturas, buscarPorFecha } = useLecturas(user, sensorActivo, fechaSeleccionada);

const lecturasFiltradas = lecturas.filter((l) => l.sensor === sensorActivo);
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
      <h1>Bienvenido</h1>
      <p style={{ fontSize: "16px",color:"white", }}>
        Este experimento tiene como objetivo medir la concentración de partículas 
        en el aire utilizando sensores conectados a un ESP32. 
        Se Realizo con la intencion de medir la calidad del aire en ciertas parte
        de la Univesidad Tecnologica de Morelia {" "}
        <img src={logoUniversidad} alt="Logo de la Utm"  className="logoUtm"
        style={{width: "80px", height:"25px", verticalAlign: "middle", margin:" 0 5px"}}  
        onClick={() => window.open("https://ut-morelia.edu.mx/", "_blank")} />
        Los datos recolectados son procesados en tiempo real y se muestran en este tablero.
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
      <h2 style={{color: COLORES.blanco, marginTop:"10px"}}> Elige entre nuestras 4 sensores disponibles</h2>
      </div>
      <div style={{justifyContent:"center", display:"flex", gap:"10px",
      marginBottom:"10px"  , borderBottom: "2px solid" + COLORES.utm, borderRadius: "10px", paddingBottom: "10px"}}>
      <button className="buttonPM" onClick={() => {
        showSnackbar2("Leyendo Partículas 2.5", "info", "#1de4f7" );  // tipo informativo
        setSensorActivo(SENSORES.PM25);
      }}>
        PM2.5
      </button>

      <button className="buttonCO2" onClick={() => {
        showSnackbar2("Leyendo Oxígeno", "info", "#4CAF50"); // tipo éxito
        setSensorActivo(SENSORES.CO2);
      }}>
        CO2
      </button>

      <button className="buttonTemp" onClick={() => {
        showSnackbar2("Leyendo Temperatura", "info", "#FF5722"); // color principal
        setSensorActivo(SENSORES.TEMPERATURA);
      }}>
        Temperatura
      </button>

      <button className="buttonPruebas" onClick={() => {
        showSnackbar2("Leyendo Pruebas de Simulación","info", "#ff00d4"); 
        setSensorActivo(SENSORES.SIMULACION);
      }}>
        Lectura de Prueba
      </button>

<button className="buttonStop" onClick={() => {
  setSensorActivo("");
  showSnackbar("-Deteniendo Simulaciones-"); // rojo, alerta
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
        // Efecto de desenfoque bonito
        borderRadius: "12px",                     // Bordes redondeados
        padding: "1rem",                          // Espacio interno
        maxHeight: "250px",                       // Altura máxima de la tabla
        overflowY: "auto"                         // Si hay muchos datos, aparece scroll
      }}
      >
        {/* Titulo de arriba */}
      <h3 style={{marginBottom:"0.2 rem", color: "white"}}>Historial de Lecturas</h3>
      
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
        <tr key={l.id} style={{ borderBottom: "1px solid black", background: "#faf9f6"}}>
          <td style={{ padding: "8px" }}>{l.sensor}</td>
          <td style={{ padding: "8px" }}>{valor} {unidad(l.sensor)} </td>
          <td style={{ padding: "8px" }}>{l.timestamp.toDate().toLocaleString()}</td>
          <td style={{ padding: "8px", fontWeight: "bold", color }}>{estado}</td>
          <td style={{ padding: "8px", fontWeight: "bold", color }}> 

            <button 
            > Ir a detalles--</button>


            
            </td>
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


  </div>
  
);

};

export default Tablero;
