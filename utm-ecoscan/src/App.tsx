// src/App.tsx
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
      <div>
        <div>
          {/* Enlaze a LoginForm.tsx y RegisterForm.tsx */}
          {showRegister ? <RegisterForm /> : <LoginForm />}
          <Button variant="contained" color="primary"
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
{/*     <Button variant="contained" color="primary">
    ¡Clic aquí!
    </Button> */}
  return (
    <div>
      <h1>Bienvenido, {user.email}</h1>
<Button
  variant="contained"
  color="error"
  onClick={() => {
    logout();
    setUser(null);  // para actualizar el estado y mostrar login otra vez
  }}
>
  Cerrar sesión
</Button>

    </div>

  );
}

export default App;
