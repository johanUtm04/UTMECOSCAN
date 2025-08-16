import React, { useState } from "react";
import { register } from "../services/auth";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(email, password);
      alert("¡Registro exitoso!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
//Contenedor Principal 🟢
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
  <Paper
    elevation={9}
    sx={{
    padding: 4,
    maxWidth: 400,
    width: "100%",
    borderRadius: 5,
    bgcolor: "#ffffffff", 
    }}
    >
    <Typography
      variant="h4"
      component="h2"
      sx={{ textAlign: "center", mb: 3, color: "#000000ff", fontWeight: 600 }}
      >Registro
    </Typography>

    <form onSubmit={handleSubmit}>
      <TextField
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
          >Registrar</Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  </Paper>
</Box>
  );
};

export default RegisterForm;
