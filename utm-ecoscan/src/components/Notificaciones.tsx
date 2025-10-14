import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {Button, Typography, Snackbar, Alert} from "@mui/material";
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import DeleteIcon from '@mui/icons-material/Delete';



export default function Notificaciones({ user }: { user: any }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifs, setNotifs] = useState<any[]>([]);
  //Mensajes Snackbar Constantes
  const [snackbar, setSnackbar] = useState({open: false, message:"", severity:"success"});
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };



  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "notificaciones"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setNotifs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [user]);

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <>
      <IconButton color="warning" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <Typography className="subtitle1" variant="subtitle1">Notificaciones</Typography>
          <MenuItem className="header-notificaciones" >
            <Button title="Marcar Como Leido"
              className="button-read" size="small" 
              onClick={() => {
              notifs.forEach(n => updateDoc(doc(db, "notificaciones", n.id), { read: true }));
              showSnackbar("Marcadas como leídas", "success");
              }}
              >
              {<MarkEmailReadIcon />}
              Marcar Como Leidas
            </Button>
            {/* Boton Para leidas (TODAS) */}
            <Button title="Marcar como No leido"
            className="button-NoRead" size="small" 
            onClick={() => { notifs.forEach(n => updateDoc(doc(db, "notificaciones", n.id), { read: false }))
            showSnackbar("Marcadas Como no leidas", "info")
            }}>
            {<MarkEmailUnreadIcon />}           
              Marcar Como NO leidas  
            </Button>
            
            <Button title="Eliminar Notificaciones"
            size="small" color="error" onClick={() => { notifs.forEach(n => deleteDoc(doc(db, "notificaciones", n.id)))
            showSnackbar("Notificaciones Eliminadas, revisa papelera para recuperarlas", "error")
            }}>
            {<DeleteIcon />}
              Eliminar Todo
            </Button>
          </MenuItem>
        {/* Caso: No hay notificaciones */}
        {notifs.length === 0 && <MenuItem>No hay notificaciones</MenuItem>}
        
        {/* Listado de Notificaciones */}
        {notifs.map(n => (
          // El onClick del MenuItem ahora SÓLO cierra el menú al hacer clic en cualquier parte que no sean los botones.
          // NOTA: Si quieres que hacer clic en el mensaje marque como leído, pon la lógica aquí:
          // onClick={() => updateDoc(doc(db, "notificaciones", n.id), { read: true })}
          <MenuItem className="body-notificaciones" key={n.id}> 
            
            <Typography variant="body2">{n.message}</Typography>
            
            {/* 1. Botón para Marcar como Leído (INDIVIDUAL) */}
            <Button title="Marcar Como leido"
              className="button-read"
              size="small" 
              onClick={(e) => {
                // ✅ CORREGIDO: Se usa 'e' (evento) para detener la propagación
                e.stopPropagation(); 
                updateDoc(doc(db, "notificaciones", n.id), { read: true });
              }}
            >
            {<MarkEmailReadIcon />}
            </Button>
            <Button title="Marcar como no leido"
            className="button-NoRead"
              size="small" 
              onClick={(e) => {
                // ✅ CORREGIDO: Se usa 'e' (evento) para detener la propagación
                e.stopPropagation(); 
                updateDoc(doc(db, "notificaciones", n.id), { read: false });
              }}
            >
              {<MarkEmailUnreadIcon />}
            </Button>

            {/* 2. Botón para Eliminar (INDIVIDUAL) */}
            <Button 
              size="small" 
              color="error"
              onClick={(e) => {
                // ✅ CORREGIDO: Se usa 'e' (evento) y la función deleteDoc
                e.stopPropagation(); 
                deleteDoc(doc(db, "notificaciones", n.id));
              }}
            >
            {<DeleteIcon />}
            </Button> 
          </MenuItem>
        ))} 
      </Menu>
        <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
        <Alert
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        severity={snackbar.severity}
        sx={{ width: '100%' }}
        >
        {snackbar.message}
        </Alert>
        </Snackbar>
    </>
    
  );
}
