import React, { useState, useEffect } from "react";
import "./App.css";
import { onUserStateChanged, logout, LoadingBar } from "./ui";
import { logo, logoUtm, fondoTablero, sensorTemperatura, co2, particulas, utmLogo25 } from "./assets";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const images = [logo, fondoTablero, sensorTemperatura, co2, particulas, utmLogo25, logoUtm];
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onUserStateChanged((currentUser) => {
      setUsuario(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <LoadingBar />;

  const handleLogout = () => {
    logout();
    setUsuario(null);
  };

  return usuario ? (
    <DashboardPage user={usuario} onLogout={handleLogout} />
  ) : (
    <LoginPage />
  );
}

export default App;
