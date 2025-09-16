import React, { useState,useEffect } from "react";
import { register } from "../services/auth";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import Checkbox from '@mui/material/Checkbox';
import {FormControlLabel} from "@mui/material";
import logo from "../assets/logoNegro.png";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState<boolean>(false);


  //Mapear Errores 🟢🟢🟢🟢
  const msjError = (codigo: string): string => {
  const errores: Record<string, string> = {
    "auth/email-already-in-use": "Este correo ya está registrado.",
    "auth/invalid-email": "El correo no es válido.",
    "auth/weak-password": "La contraseña es muy débil.",
  };

  return errores[codigo] || "Ocurrió un error inesperado, intenta de nuevo.";
    }
  
//Mapear Errores 🟢🟢🟢🟢
  const handleLogin = () =>{
    if (checked) {
      localStorage.setItem("remember", "true");
    }else{
      localStorage.removeItem("rememberMe");
    }
    console.log("Intento de login, con recordarme", checked)
  };

  useEffect(()=>{
    const saved = localStorage.getItem("checked");
    if (saved === "true") {
      setChecked(true);
    }
  },[]);

//Mapear Errores 🟢🟢🟢🟢
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
        setError("Ocurrió un error inesperado, intenta de nuevo.");
      }
    }
  };

  return (
//Contenedor Principal 🟢
<Box
sx={{minHeight: "90vh",display: "flex",flexDirection: "column",justifyContent: "center",
      alignItems: "center",border: "2px solid #1de4f7",padding: 2, 
      backgroundColor: "#000000ff",
      backgroundImage: './assets/',  backgroundSize: "cover", backgroundPosition: "center", borderRadius:"20px",
      }}
  >
  <Box sx={{ display: "flex", justifyContent: "center", mb: 1,}}>
  <img src={logo} alt="Logo UTMECOSCAN" style={{ width: 300, height: 'auto' }} />
  </Box>
  <Paper
    elevation={9}
    sx={{
    padding: 4,
    maxWidth: 400,
    width: "100%",
    borderRadius: 5,
    bgcolor: "#000000ff", 
    }}
    >
    <Typography
      variant="h4"
      component="h2"
      sx={{ textAlign: "left", mb: 1, color: "#ffffffff", fontWeight: 600}}
      >Registrate
    </Typography>

{/*Mapear Errores 🟢🟢🟢🟢 */}
    <form onSubmit={handleSubmit}>
      <TextField
          sx={{
          "& .MuiOutlinedInput-root": {
          "& fieldset": {
          borderColor: "#abb4b4ff", //color normal
          },
          "&:hover fieldset": {
          borderColor: "#00bcd4", //cuando pasas el mouse
          },
          "&.Mui-focused fieldset": {
          borderColor: "#00bcd4", //cuando está enfocado
          },
          },
          input: { color: "white" }, // texto dentro del input
          label: { color: "grey" }, // label
          }}
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
      
      <TextField
          sx={{
          "& .MuiOutlinedInput-root": {
          "& fieldset": {
          borderColor: "#abb4b4ff", //color normal
          },
          "&:hover fieldset": {
          borderColor: "#00bcd4", //cuando pasas el mouse
          },
          "&.Mui-focused fieldset": {
          borderColor: "#00bcd4", //cuando está enfocado
          },
          },
          input: { color: "white" }, // texto dentro del input
          label: { color: "grey" }, // label
          }}
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
                <FormControlLabel
                control={
                <Checkbox
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                  inputProps={{ 'aria-label': 'controlled' }}
                  /* 🖌️ */
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
            sx={{
              mt: 2,
              bgcolor: "#1de4f7", 
              "&:hover": { bgcolor: "#1de4f7" },
              borderRadius: 2,
              paddingY: 1.2,
              fontWeight: 600,
            }}
            onClick={handleLogin}
            
          >Registrar</Button>
      {error && <p style={{ color: "blue" }}>{error}</p>}
    </form>
  </Paper>
</Box>
  );
};

export default RegisterForm;
