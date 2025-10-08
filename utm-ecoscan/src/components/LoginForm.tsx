//Refacterizacion (v1)
//Importaciones
import React, { useState } from "react";
import { login } from "../services/auth";
import { TextField, Button, Box, Typography} from "@mui/material";
import logo from "../assets/imgs/logoNegro2.png";
import { loginWithGoogle } from "../services/auth";
import GoogleIcon from "../assets/imgs/google.png";
import primaryButton from "./common";

//Declaramos El componente
function LoginForm () {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const passwordError = password.length > 0 && password.length < 4;
  
  //Funcion Asincrona(sin afectar ejecucion principal)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      alert("¡Login exitoso!");
    } catch (err: any) {
      alert("!Error, Credenciales Incorrectas¡")
    }
  };

//Dibujado del componente
return (
//Contenedor Principal
<Box className="login-container-father">
  {/* Imagen Logo UTMECOSCAN */}
  <Box className="logo-container">
  <img src={logo} alt="Logo UTMECOSCAN" className="logo-login-register"/>
  </Box>
    {/* Seccion del Formulario*/}
    <Typography variant="h5" className="title-login-register">
    Iniciar Sesión En UtmEcoScan
    </Typography>
      <form onSubmit={handleSubmit} className="form-container">
        {/* Input Correo Electrónico */}
        <Typography className="label-login-register">
        Direccion de Correo Electrónico
        </Typography>
        <TextField
        className="input-login-register"
        label="Correo electrónico"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        variant="outlined"
        size="medium"
        margin="normal"
        helperText={!email.includes("@") && email.length > 0 ? "Introduce un correo válido" : ""}
        error={!email.includes("@") && email.length > 0}
        required
        />
        {/* Input Contraseña */}
        <Typography variant="body1" className="label-login-register">
        Contraseña
        </Typography>
        <TextField
        className="input-login-register"
        label="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        variant="outlined"
        size="medium"
        margin="normal"
        error={passwordError}
        helperText={passwordError ? "La contraseña debe tener al menos 6 caracteres" : ""}
        required
        />
        {error && (
        <Typography variant="body2">
        {error}
        </Typography>
        )}
        <Box>
        {primaryButton({ text: "Iniciar sesión", onClick: () => {} })}
        </Box>
      </form>

      <Box className="title-login-google">
      O inicia sesión con
      </Box>
      <Button
      onClick={loginWithGoogle}
      className="button-login-google">
      <img src={GoogleIcon} alt="Google" style={{ width: 20, height: 20 }} />
      Iniciar sesión con Google
      </Button>
    </Box>
  );
};

export default LoginForm;
