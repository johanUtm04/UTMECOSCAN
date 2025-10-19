import { useState } from "react";  //Importacion variable de estado--
import { Button } from "../ui";           //Importacion de Boton de material mui--
import { RegisterForm, LoginForm } from "../ui"; //Importacion de componentes Register y Login-- 
import Footer from "../components/Footer";  //Importacion del componente footer

function LoginPage (){
  const [showRegister, setShowRegister] = useState(false);
  return (
    <div className="main-container-app">
      {showRegister ? <RegisterForm /> : <LoginForm />} {/* Usuario toma una desicion entre cada componente, operador TERNARIOS-- */}
      
      <Button
        className="button-alternar-login-register"
        onClick={() => setShowRegister(!showRegister)}
      >
        {/* Cambia el texto del boton entre uno y otro */}
        {showRegister
          ? "¿Ya tienes cuenta? Iniciar sesión"
          : "¿No tienes cuenta? Registrarte"}
      </Button>
      <Footer />  {/* Mostramos el footer-- */}
    </div>
  );
};

export default LoginPage;
