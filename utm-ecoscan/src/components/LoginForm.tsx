//Importaciones
import React, { useEffect, useState } from "react";
import { login } from "../services/auth";
import { TextField, Button, Box, Typography, Paper, colors } from "@mui/material";
import logo from "../assets/logoClaro.png";
import { loginWithGoogle, loginWithFacebook } from "../services/auth";
import GoogleIcon from "../assets/Google.jpg";
import GitIcon from "../assets/GitHub.png"

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

  return (
//Box (Es como un div pero con estilos integrados Gracias a UI)
<Box sx={{minHeight: "90vh",display: "flex",flexDirection: "column",justifyContent: "center",
      alignItems: "center",border: "5px solid #1de4f7",padding: 2,
      backgroundColor: "#ffffffff",
      backgroundImage: './assets/',  backgroundSize: "cover", backgroundPosition: "center", borderRadius:"20px",
      }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 1,}}>
        <img src={logo} alt="Logo UTMECOSCAN" style={{ width: 300, height: 'auto' }} />
      </Box>

      <Paper elevation={8} sx={{ padding: 1, maxWidth: 400, width: "100%", borderRadius: 3,
          bgcolor: "#ffffffff", }}>

        <Typography variant="h4" component="h2" 
        sx={{ textAlign: "left", mb: 1, color: "#000000ff", fontWeight: 1000, }}>
        Iniciar Sesión
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
          /* 🖌️ */
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
          input: { color: "black" }, // texto dentro del input
          label: { color: "grey" }, // label
          }}
            type="email"
            label="Correo electrónico"
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
          /* 🖌️ */
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
          input: { color: "black" }, // texto dentro del input
          label: { color: "grey" }, // label
          }}
            type="password"
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
            <Typography variant="body2" sx={{ color: "red", mt: 1, mb: 2 }}>
              {error}
            </Typography>
          )}

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
          >Iniciar Sesión</Button>
        </form>
      </Paper>
      <Box
      sx={{
        color:"black",
        fontWeight:600,
        mt:2,
      }}
      >
      O inicia sesión con
      </Box>
<Button
  variant="outlined"
  fullWidth
  onClick={loginWithGoogle}
  sx={{
    mt: 2,
    textTransform: "none", // mantiene mayúsculas/minúsculas normales
    fontWeight: "bold",
    borderColor: "#b0b2b4ff",
    color: "black",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "#f5f5f5",
      borderColor: "#c6c6c6",
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 1, 
  }}
>
  <img src={GoogleIcon} alt="Google" style={{ width: 20, height: 20 }} />
  Iniciar sesión con Google
</Button>


</Box>
  );
};

export default LoginForm;
