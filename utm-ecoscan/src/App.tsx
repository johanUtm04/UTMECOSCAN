//Refacterizacion (v1)
//Importaciones
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {Typography } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LoadingBar from "./components/LoadingBar";
import { onUserStateChanged, logout } from "./services/auth";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Tablero from "./pages/Tablero";
import Notificaciones from "./components/Notificaciones";
import "./App.css";
import logoUtm from "./assets/imgs/logo.gif"
import logo from "./assets/imgs/logoClaro.png";
import fondoTablero from "./assets/imgs/5072612.jpg";
import sensorTemperatura from "./assets/imgs/SensorTemperatura.png"
import co2 from "./assets/imgs/co2.png";
import particulas from "./assets/imgs/particulas.png";
import utmLogo25 from "./assets/imgs/utmLogo25.png"

//Declaramos el componente
function App() {
  const [usuario, setUsuario] = useState<any>(null);
  const [showRegister, setShowRegister] = useState(false);

  const [loading, setLoading] = useState(true);

  //Menu Desplegable
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  

  // Precargar imágenes(Evitar Lentitud al Montar el codigo)
  useEffect(() => {
    const images = [logo, fondoTablero, sensorTemperatura, co2, particulas, utmLogo25, logoUtm];
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Escuchar cambios de usuario
  useEffect(() => {
    const unsubscribe = onUserStateChanged((currentUser) => {
      setUsuario(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  //Mini Linea de Carga superior (en caso de necesitarla)
  if (loading) {
    return (
      <>
      <LoadingBar />
      </>
    );
  }

  //Dibujado del componente
  if (!usuario) {
    return (
      <div className="main-container-app">
        {showRegister ? <RegisterForm /> : <LoginForm />}
        <Button
          className="button-alternar-login-register"
          onClick={() => setShowRegister(!showRegister)}>
          {showRegister
            ? "¿Ya tienes cuenta? Iniciar sesión"
            : "¿No tienes cuenta? Registrarte"}
        </Button>
<footer className="footer-app">
<p className="footer-title">Conoce la tecnología detrás del monitoreo ambiental UTM EcoScan</p>
  <div className="footer-social">
    <a
      href="https://www.google.com/search?q=¿Qué+son+las+partículas+PM2.5+y+PM10%3F"
      target="_blank"
      rel="noopener noreferrer"
      className="footer-btn"
      title="Sensor de Partículas"
    >
      <img src={particulas} alt="Sensor De Partículas" className="footer-icon" />
    </a>
    <a
      href="https://www.google.com/search?q=Sensor+de+CO2+y+su+funcionamiento"
      target="_blank"
      rel="noopener noreferrer"
      className="footer-btn"
      title="Sensor de CO₂"
    >
      <img src={co2} alt="Sensor De CO2" className="footer-icon" />
    </a>
    <a
      href="https://www.google.com/search?q=Sensor+de+temperatura+ambiental"
      target="_blank"
      rel="noopener noreferrer"
      className="footer-btn"
      title="Sensor de Temperatura"
    >
      <img src={sensorTemperatura} alt="Sensor De Temperatura" className="footer-icon" />
    </a>
    <a
      href="https://ut-morelia.edu.mx/"
      target="_blank"
      rel="noopener noreferrer"
      className="footer-btn"
      title="Universidad Tecnológica de Morelia"
    >
      <img src={utmLogo25} alt="Logo de la Universidad" className="footer-icon" />
    </a>
  </div>
  <div className="footer-copyright">
    © 2025 UTM EcoScan | Todos los derechos reservados UTM (Universidad Tecnológica de Morelia)
  </div>
</footer>
      </div>
    );
  }

  //Dibujado del tablero
  return (
    <div className="main-container-tablero">
      {/* Header --Navbar*/}
      <div className="navbar-tablero">
        <img
          src={logoUtm}
          alt="Logo tics utm"
          className="logo-tics"
          onClick={() =>
            window.open(
              "https://ut-morelia.edu.mx/index.php/tecnologias-de-la-informacion/",
              "_blank"
            )
          }
        />
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#110b3b" }}>
          Sistema de Medicion de Calidad del Aire
        </Typography>
        {/* Notificaciones 🔔 */}
        <Notificaciones user={usuario} />
        <div className="message-welcome-user-container">
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#110b3b" }}>
            ¡Bienvenido! {usuario.displayName || usuario.email}
          </Typography>
          {/* Avatar con menú */}
          <IconButton size="large" onClick={handleMenu} color="inherit">
            {usuario.photoURL ? (
              <img className="img-user"
                src={usuario.photoURL}
                alt={usuario.displayName}
              />
            ) : (
              <AccountCircle sx={{ fontSize: 40, color: "#110b3b" }} />
            )}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleClose}>Perfil</MenuItem>
            <MenuItem onClick={handleClose}>Ajustes</MenuItem>
            <MenuItem
              onClick={() => {
                logout();
                setUsuario(null);
                handleClose();
              }}
            >
              Cerrar sesión
            </MenuItem>
          </Menu>
        </div>
      </div>
      {/* Tablero Render */}
      <Tablero user={usuario} />
    </div>
  );
}
export default App;
