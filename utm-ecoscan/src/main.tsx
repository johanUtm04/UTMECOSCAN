/* Importaciones */
import { StrictMode } from 'react'  /* envoltorio(opcional) es recomendado por seguridad */
import { createRoot } from 'react-dom/client' /* Funcion para iniciar aplicacion   */
import './index.css' //Conexion con los estilos (css)
import App from './App.tsx' /* Importacion del componente principal */
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)
