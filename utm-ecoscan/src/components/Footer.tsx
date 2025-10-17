import React from "react";
import { sensorTemperatura, co2, utmLogo25 } from "../assets";

const Footer: React.FC = () => (
  <footer className="footer-app">
    <p className="footer-title">
      Conoce la tecnología detrás del monitoreo ambiental UTM EcoScan
    </p>
    <div className="footer-social">
      <a href="https://www.google.com/search?q=Sensor+de+CO2+y+su+funcionamiento" target="_blank" rel="noopener noreferrer" className="footer-btn" title="Sensor de CO₂">
        <img src={co2} alt="Sensor De CO2" className="footer-icon" />
      </a>
      <a href="https://www.google.com/search?q=Sensor+de+temperatura+ambiental" target="_blank" rel="noopener noreferrer" className="footer-btn" title="Sensor de Temperatura">
        <img src={sensorTemperatura} alt="Sensor De Temperatura" className="footer-icon" />
      </a>
      <a href="https://ut-morelia.edu.mx/" target="_blank" rel="noopener noreferrer" className="footer-btn" title="Universidad Tecnológica de Morelia">
        <img src={utmLogo25} alt="Logo de la Universidad" className="footer-icon" />
      </a>
    </div>
    <div className="footer-copyright">
      © 2025 UTM EcoScan | Todos los derechos reservados UTM (Universidad Tecnológica de Morelia)
    </div>
  </footer>
);

export default Footer;
