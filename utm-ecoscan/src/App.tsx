/* ===================== IMPORTACIONES ===================== 📗👨‍💻 */
// Librerías externas
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Box, Typography } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LoadingBar from "./components/LoadingBar";
// Servicios
import { onUserStateChanged, logout } from "./services/auth";

// Componentes
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Tablero from "./pages/Tablero";
import Notificaciones from "./components/Notificaciones";

// Estilos y assets
import "./App.css";
import logo from "./assets/imgs/logoClaro.png";
import fondoTablero from "./assets/imgs/5072612.jpg";


/* ===================== FUNCIÓN PRINCIPAL ===================== 👨‍💻📗 */
function App() {
  /* ------------------- STATES ------------------- */
  const [usuario, setUsuario] = useState<any>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [fechaHora, setFechaHora] = useState(new Date());
  const [loading, setLoading] = useState(true);

  /* Menu usuario */
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  /* ------------------- FUNCIONES AUXILIARES ------------------- */
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  /* ------------------- EFFECTS ------------------- */
  // Actualizar hora cada segundo
  useEffect(() => {
    const intervalo = setInterval(() => {
      setFechaHora(new Date());
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  // Precargar imágenes
  useEffect(() => {
    const images = [logo, fondoTablero];
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Escuchar cambios de usuario
  useEffect(() => {
    const unsubscribe = onUserStateChanged((currentUser) => {
      setUsuario(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Carga inicial del usuario
  useEffect(() => {
    const unsubscribe = onUserStateChanged((currentUser) => {
      setUsuario(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  /* ------------------- RENDERS CONDICIONALES ------------------- */
  if (loading) {
    return (
      <>
      <LoadingBar />
      </>
    );
  }

  if (!usuario) {
    return (
      <div style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#0d1117",
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "1px",
          color: "white",
          position: "relative",
          zIndex: 1,
          overflowY: "auto"
        }}>
          {showRegister ? <RegisterForm /> : <LoginForm />}
          <Button
            className="button-alternar-login-register"
            onClick={() => setShowRegister(!showRegister)}
          >
            {showRegister
              ? "¿Ya tienes cuenta? Iniciar sesión"
              : "¿No tienes cuenta? Registrarte"}
          </Button>
        </div>
      </div>
    );
  }

  /* ------------------- INTERFAZ PRINCIPAL ------------------- */
  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", overflow: "hidden" }}>
      {/* Fondo tablero */}
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

      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "2px 5px",
        background: "linear-gradient(135deg, #2980b9, #6dd5fa, #ffffff)",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        marginBottom: "0px",
        border: "3px solid black"
      }}>
        <img
          src={logo}
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

        <Notificaciones user={usuario} />

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#110b3b" }}>
            ¡Bienvenido! {usuario.displayName || usuario.email}
          </Typography>

          {/* Avatar con menú */}
          <IconButton size="large" onClick={handleMenu} color="inherit">
            {usuario.photoURL ? (
              <img
                src={usuario.photoURL}
                alt={usuario.displayName}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "2px solid black"
                }}
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

      {/* Contenido principal */}
      <Tablero user={usuario} />
    </div>
  );
}

export default App;
