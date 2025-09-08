import React, { useEffect, useState } from "react";
import { onUserStateChanged, logout } from "./services/auth";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Tablero from "./pages/Tablero";
import Button from '@mui/material/Button';
import Fondo from './assets/5072612.jpg';

function App() {
  const [user, setUser] = useState<any>(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const userGuapo = onUserStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => userGuapo();
  }, []);

  if (!user) {
    return (
      <div style={{ 
        position: "relative", 
        width: "100%", 
        minHeight: "100vh", 
        overflow: "hidden" 
      }}>
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
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: "100vh",   // se ajusta a toda la pantalla
          padding: "20px",      // espacio interior
          color: "white",
          position: "relative",
          zIndex: 1,
          overflowY: "auto"     // si crece, aparece scroll
        }}>
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

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center" 
      }}>
        <h1>Bienvenido, {user.email}</h1>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            logout();
            setUser(null);
          }}
        >
          Cerrar sesión
        </Button>
      </div>
      <Tablero user={user} />
    </div>
  );
}

export default App;
