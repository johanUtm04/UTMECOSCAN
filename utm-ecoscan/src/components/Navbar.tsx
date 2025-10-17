import React from "react";
import { Typography, IconButton, Menu, MenuItem } from "@mui/material";
import { AccountCircle } from "../ui";
import { logout } from "../ui";
import Notificaciones from "./Notificaciones";
import { logoUtm } from "../assets";

interface NavbarProps {
  user: any;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <div className="navbar-tablero">
      <img
        src={logoUtm}
        alt="Logo tics utm"
        className="logo-tics"
        onClick={() =>
          window.open(
            "https://ut-morelia.edu.mx/index.php/tecnologias-de-la-informacion/",
            "_blank"
          )
        }
      />
      <Typography variant="h5" sx={{ fontWeight: 600, color: "#110b3b" }}>
        Sistema de Medición de Calidad del Aire
      </Typography>

      <Notificaciones user={user} />

      <div className="message-welcome-user-container">
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#110b3b" }}>
          ¡Bienvenido! {user.displayName || user.email}
        </Typography>

        <IconButton size="large" onClick={handleMenu} color="inherit">
          {user.photoURL ? (
            <img className="img-user" src={user.photoURL} alt={user.displayName} />
          ) : (
            <AccountCircle sx={{ fontSize: 40, color: "#110b3b" }} />
          )}
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleClose}>Perfil</MenuItem>
          <MenuItem onClick={handleClose}>Ajustes</MenuItem>
          <MenuItem
            onClick={() => {
              onLogout();
              handleClose();
            }}
          >
            Cerrar sesión
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Navbar;
