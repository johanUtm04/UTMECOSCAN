/* Importaciones */
import { useEffect, useState } from "react";  /* hooks de estado */
import { onUserStateChanged, logout } from "./services/auth"; /* Funciones traidas del auth */
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Tablero from "./pages/Tablero";
import Button from '@mui/material/Button';
import Fondo from './assets/5072612.jpg';
import { Typography } from "@mui/material";
import logo from './assets/tics.jfif';
import fondoTablero from "./assets/fondoTablero.jpg";

function App() {
  const [usuario, setUsuario] = useState<any>(null); 
  const [showRegister, setShowRegister] = useState(false);
  const [fechaHora, setFechaHora] = useState(new Date());
  const [hover, setHover] = useState(false);

useEffect(() => {
  const intervalo = setInterval(() => {
    setFechaHora(new Date());
  }, 1000);
  
  return () => clearInterval(intervalo);
}, []);

  useEffect(() => { //1.-onUserStateChanged == Con esta funcion firebase detecta un login
    const usuario = onUserStateChanged((currentUser) => { //2.-Al montar componente, empezamos a escuchar cambios en el usuario con el listener o bien le asignamos uno
      setUsuario(currentUser); /*3.- La variable usuario toma el valor de la funcion currentUser y actuzaliza el state  */ 
    });
    return () => usuario(); //Al desmontar, dejamos de escuchar cambios, para no tener fugas de memoria.
  }, []);

  /* En caso de que haya un usuario autenticado nos quedamos en esa vista */
  if (!usuario) {
    return (
      <div style={{position: "relative", width: "100%", minHeight: "100vh", overflow: "hidden" }}>
        {/* Imagen de Fondo */}
        <img 
          src={Fondo} 
          alt="fondo"
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover", 
            position: "fixed",
            top: 0,
            left: 0,
          }}
        />        
        {/* Div del formulario */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          minHeight: "100vh", padding: "20px", color: "white", position: "relative", zIndex: 1, overflowY: "auto" }}>
          {/* Condicional si es true nos vamos a  registro, 
          y si es false a Login, este valor booleano lo controlamos con El Onclick*/}
          {showRegister ? <RegisterForm /> : <LoginForm />}
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowRegister(!showRegister)}
            sx={{
              bgcolor: "#1de4f7",
              "&:hover": { bgcolor: "#1de4f7" },
              fontWeight: 400,
              marginTop: 2
            }}
          >
            {showRegister
              ? "¿Ya tienes cuenta? Iniciar sesión"
              : "¿No tienes cuenta? Registrarte"}
          </Button>
        </div>
      </div>
    );
  }
  /* Si hay un usuario autenticado Dibujamos esta seccion */
  return (
  /* Div principal */
  <div style={{ position: "relative", width: "100%", minHeight: "100vh", overflow: "hidden" }}>
  <img 
    src={fondoTablero} 
    alt="Fondo tablero"
    style={{ 
      width: "100%", 
      height: "100%", 
      objectFit: "cover", 
      position: "fixed", 
      top: 0, 
      left: 0, 
      zIndex: -1 
    }}
  />
  {/* 2do Div */}
  <div style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 5px",
    backgroundColor: "#88a2f6ff",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    marginBottom: "20px",
    border: "3px solid black",
  }}>
  <img src={logo}  alt="Logo tics utm" style={{ height: "50px", filter: hover ? "brightness(1.2)" : "brightness(1)" }}
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}
  />
    <Typography variant="h5"  sx={{fontWeight:600, color:"#110b3b"}}>
    Sistema de Medicion de Calidad del Aire
  </Typography>
  {usuario && usuario.photoURL && (
  <img 
    src={usuario.photoURL} 
    alt={usuario.displayName} 
    style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid #110b3b" }} 
  />
)}

  {/* Nombre de Google */}
  <Typography variant="h6" sx={{fontWeight:600, color:"#110b3b"}}>
  Bienvenido, {usuario.displayName || usuario.email}
  </Typography>
  <Button
    variant="contained"
    color="error"
    onClick={() => { logout(); setUsuario(null); }}
    sx={
      {
      fontWeight:500,
      border: "3px solid #110b3b",
      }
    }
  >Cerrar sesión</Button>
</div> 
      {/* Dibujamos el tablero */}
      <Tablero user={usuario} />
    </div> 
  );
}

export default App;


/* Comentarios Estilos: */
/* display: flex = activa el modo flexbox para organizar contenido
flexDirection: "colum" = coloca en columna
alignItems: "center" = centra los hijos Horizontalemnte
justifyContent = "center" centra los hijos verticalmente
minHeight = "100vh" = 100% de la pantalla
padding = "20px" = agrega un espacio de 20px de margen interior alrrededor 
position = relative = permite mover hijos en direcciones
zIndex: 1 = asegura que el div quede encima de otros elementos que tengar menor zIndex
overFlow= "auto" si el contenido es mas alto que la pantalla, aparece un scroll vertical 
fontWeight: peso del texto
"&:hover": { bgcolor: "#1de4f7" } = manetiene el mismo color, al pasar el mouse
*/