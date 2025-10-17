import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Tablero } from "../ui";

interface DashboardPageProps {
  user: any;
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout }) => (
  <div className="main-container-tablero">
    <Navbar user={user} onLogout={onLogout} />
    <Tablero user={user} />
    <Footer />
  </div>
);

export default DashboardPage;
