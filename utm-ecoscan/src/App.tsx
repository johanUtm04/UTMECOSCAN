import "./App.css"; //Hoja de estilos--
import { logout, LoadingBar, LoginPage, DashboardPage } from "./ui";//Importacion de componentes
import { logo, logoTics, fondoTablero, sensorTemperatura, co2, particulas, utmLogo25, logoUniversidad } from "./assets";//Importacion de las imagenes
import { usePreloadImages } from "./hooks/usePreloadImages"; //Importacion de Effectos--
import { useAuthListener } from "./hooks/useUnsubscribe";

function App() {
  //Enlaze a useEffect de Pre-Cargar imgs--
  usePreloadImages([logo, logo, logoTics, fondoTablero, sensorTemperatura, co2, particulas, utmLogo25, logoUniversidad]);
  //Asignar Valores del AuthListener--
  const {usuario, loading} = useAuthListener();
  //Barra de carga superior--
  if (loading) return <LoadingBar />;
  //Funcion de firebase que se encarga de cerrar la sesion del usuario 
  const handleLogout = () => {
    logout();
  };

  //Renderizado en pantala, si hay usuario muestra x pantalla y si no, el login--
  return usuario ? (
    <DashboardPage user={usuario} onLogout={handleLogout} />
  ) : (
    <LoginPage />
  );
}

//Exportacion del componente
export default App;
