import React, { useState } from "react";
import { login } from "../services/auth";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import logo from "../assets/logoClaro.png";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const passwordError = password.length > 0 && password.length < 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      alert("¡Login exitoso!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (

    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#ffffffff",
        padding: 2,
      }}
    >

  <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
    <img src={logo} alt="Logo Empresa" style={{ width: 300, height: 'auto' }} />
  </Box>

      <Paper
        elevation={8}
        sx={{
          padding: 4,
          maxWidth: 400,
          width: "100%",
          borderRadius: 3,
          bgcolor: "#ffffffff", 
        }}
        >
        <Typography
          variant="h4"
          component="h2"
          sx={{ textAlign: "center", mb: 3, color: "#000000ff", fontWeight: 600 }}
        >
          Iniciar Sesión
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
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
          >Entrar</Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginForm;
