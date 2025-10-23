import React from "react";  //Importacion de React--
import {Notificaciones, Typography, IconButton, Menu, MenuItem, AccountCircle  } from "../ui"; //Importacion de componentes--
import type { NavbarProps } from "../ui";//Importacion de compontes (type)--
import { logoTics } from "../assets"; //Importacion de Imagenes--
import { COLORES } from "../constantes";

function Navbar({user, onLogout}: NavbarProps){
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <div className="navbar-tablero">
      <img src={logoTics}alt="Logo tics utm" className="logo-tics"
      onClick={() =>window.open("https://ut-morelia.edu.mx/index.php/tecnologias-de-la-informacion/","_blank")}/>
      <Typography variant="h5" sx={{ fontWeight: 600, color:COLORES.fondo, border: "2px solid red" }}>
        Sistema de Medición de Calidad del Aire--
      </Typography>
      <div className="message-welcome-user-container">
        <Typography variant="h5" sx={{ fontWeight: 700, color:COLORES.fondo, border: "2px solid orange" }}>
          ¡Bienvenido! {user.displayName || user.email}
        </Typography>
        <IconButton size="large" onClick={handleMenu} color="inherit">
          {user.photoURL ? (<img className="img-user" src={user.photoURL} alt={user.displayName} />) : (
          <AccountCircle sx={{ fontSize: 40, color:COLORES.fondo }} />)}
        </IconButton>
        <div style={{border: "2px solid red"}}>
        <Notificaciones user={user} />
        </div>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}transformOrigin={{ vertical: "top", horizontal: "right" }}>
          <MenuItem onClick={handleClose}>Perfil</MenuItem>
          <MenuItem onClick={handleClose}>Ajustes</MenuItem>
          <MenuItem
            onClick={() => {
              onLogout();
              handleClose();
            }}
          >Cerrar sesión</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Navbar;
