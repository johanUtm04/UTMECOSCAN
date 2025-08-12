// src/components/LoginForm.tsx
import React, { useState } from "react";
import { login } from "../services/auth";
import { TextField, Button } from "@mui/material";

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
      <div>
        <h2>
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit}>
          <TextField
            type="email" //Tipo de dato 
            label="Correo electrónico"  //Etiqueta
            color="primary" //Color principal (azul)
            value={email} //valor a primer instancia 'null'
            onChange={(e) => setEmail(e.target.value)} //actualiza 'email' con setEmail 
            fullWidth //Toma todo el ancho del contenedor
            variant="outlined"  //Boorde moderno y claro
            size="medium" //Tamaño general (padding, altura, fuente)
            helperText ="Introduce un correo valido" //Mensaje posterior
            error={ !email.includes('@') && email.length > 0 }  //Marca un error si no tiene @
            required
          />

          <TextField
            type="password" //Tipo de dato
            label = "Contraseña"  //Etiqueta
            color = "primary" //Color principal (azul)
            value={password}  //Valor a primera instancia 'null'
            onChange={(e) => setPassword(e.target.value)} //actualiza 'password' con setPassword 
            fullWidth //Toma todo el ancho del contenedor 
            variant="outlined" //Borde moderno y claro
            size="medium" //Tamaño general
            error={passwordError}
            helperText={passwordError ? "La contraseña debe tener al menos 6 caracteres" : ""}
            required
          />

          {error && (
            <p style={{ color: 'red', fontSize: '14px' }}>
              {error}
            </p>
          )}
          <Button
          variant = 'contained'
          color="primary"
          type="submit">Entrar
          </Button>
        </form>

        <p>
          ¿No tienes cuenta?{" "}
          <span>
            Regístrate
          </span>
        </p>
      </div>
  );
};

export default LoginForm;
