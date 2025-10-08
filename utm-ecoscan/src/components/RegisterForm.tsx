//Refacterizacion (v1)
//Importaciones
import React, { useState,useEffect } from "react";
import { register } from "../services/auth";
import { TextField, Button, Box, Typography} from "@mui/material";
import Checkbox from '@mui/material/Checkbox';
import {FormControlLabel} from "@mui/material";
import logo from "../assets/imgs/logoNegro2.png";

//Declaramos el componente
function RegisterForm () {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const msjError = (codigo: string): string => {

  //Constante para mensajes de errores
  const errores: Record<string, string> = {
    "auth/email-already-in-use": "Este correo ya está registrado.",
    "auth/invalid-email": "El correo no es válido.",
    "auth/weak-password": "La contraseña es muy débil.",
  }; return errores[codigo] || "Ocurrió un error inesperado, intenta de nuevo.";}

  useEffect(()=>{
  const saved = localStorage.getItem("checked");
    if (saved === "true") {
      setChecked(true);
    }
  },[]);

  //Constante para recordar
  const handleLogin = () =>{
    if (checked) {
      localStorage.setItem("remember", "true");
    }else{
      localStorage.removeItem("remember");
    }
      console.log("Intento de login, con recordarme", checked)
  }   ;

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    try {
      await register(email, password);
      alert("¡Registro exitoso!");
    } catch (err: any) {
      console.log('error: ', err)
      const code = err.code;
    if (code) {
    setError(msjError(code));
    console.log('el error exacto es:', error);
    }else{
    setError("Ocurrió un error inesperado, intenta de nuevo."); }}};

//Dibujado del componente
return (
<Box className="login-container-father">
  <Box className="logo-container">
  <img src={logo} alt="Logo UTMECOSCAN" className="logo-login-register"/>
  </Box>
    <Typography
      variant="h5"
      className="title-login-register"
      >Registrate
    </Typography>
    <form onSubmit={handleSubmit} className="form-container">
      {/* Input Correo Electrónico */}
      <Typography className="label-login-register">
      Direccion de Correo Electrónico
      </Typography>
      <TextField
        className="input-login-register"
        type="email"
        label="Correo electronico"
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
        type="password"
        label="Contraseña"
        placeholder="Correo"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        variant="outlined"
        size="medium"
        margin="normal"
        required
      />
        {/* Input Repetir Contraseña */}
        <Typography variant="body1" className="label-login-register">
        Repetir Contraseña
        </Typography>
      <TextField
        className="input-login-register"
        type="password"
        label="Repetir Contraseña"
        placeholder="Repetir Contraseña"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
        fullWidth
        variant="outlined"
        size="medium"
        margin="normal"
        required
      />
      <FormControlLabel
        control={
          <Checkbox
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          inputProps={{ 'aria-label': 'controlled' }}
          sx={{
          color: "white",
          "&.Mui-checked":{
          color:"#00bcd4"
          }
          }}
          />
          }
          label="Recordarme"
          sx={{
          color:"white"
          }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="button-registerLogin"
            onClick={handleLogin}
          >Registrar
          </Button>
      {error && <p style={{ color: "red", fontWeight:600 }}>{error}</p>}
    </form>
</Box>
  );
};

export default RegisterForm;
