
import React, { useEffect, useState } from "react";
import { onUserStateChanged, logout } from "./services/auth";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Button from '@mui/material/Button';

function App() {
  const [user, setUser] = useState<any>(null);
  const [showRegister, setShowRegister] = useState(false);
  useEffect(() => {
    const unsubscribe = onUserStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', width: '100%'  }}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', }}>
          {showRegister ? <RegisterForm /> : <LoginForm />}
          <Button variant="contained" color="primary"
            onClick={() => setShowRegister(!showRegister)}
              sx={{
              bgcolor: "#1de4f7", 
              "&:hover": { bgcolor: "#1de4f7" },
              fontWeight: 400,
            }}
          >
            {showRegister
              ? "¿Ya tienes cuenta? Iniciar sesión"
              : "¿No tienes cuenta? Registrartee"}
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div>
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
  );
}
export default App;
