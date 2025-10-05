//Boton para Seccion de Inicio de Sesión
import { Button } from "@mui/material";
import "../assets/globalStyles.css";

//Interfaz para las propiedades del boton iniciar sesión o registrar
interface PrimaryButtonProps {
  text: string;
  onClick: () => void;
}

//Boton Iniciar Sesión o Registrar
const primaryButton=({ text, onClick }: PrimaryButtonProps) => {
  return (
    <Button 
        type="submit"
        className="button-registerLogin"
        onClick={onClick}
    >
        {text}
    </Button>
  );
};

export default primaryButton;   