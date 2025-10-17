import React, { useState } from "react";
import { Button } from "../ui";
import { RegisterForm, LoginForm } from "../ui";
import Footer from "../components/Footer";

const LoginPage: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="main-container-app">
      {showRegister ? <RegisterForm /> : <LoginForm />}
      <Button
        className="button-alternar-login-register"
        onClick={() => setShowRegister(!showRegister)}
      >
        {showRegister
          ? "¿Ya tienes cuenta? Iniciar sesión"
          : "¿No tienes cuenta? Registrarte"}
      </Button>
      <Footer />
    </div>
  );
};

export default LoginPage;
