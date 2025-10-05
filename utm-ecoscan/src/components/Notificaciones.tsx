import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function Notificaciones({ user }: { user: any }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifs, setNotifs] = useState<any[]>([]);

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
      <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem>
          <Typography variant="subtitle1">Notificaciones</Typography>
          <Button size="small" onClick={() => notifs.forEach(n => updateDoc(doc(db, "notificaciones", n.id), { read: true }))}>
            Marcar todo leído
          </Button>
          <Button size="small" color="error" onClick={() => notifs.forEach(n => deleteDoc(doc(db, "notificaciones", n.id)))}>
            Borrar todo
          </Button>
        </MenuItem>
        {notifs.length === 0 && <MenuItem>No hay notificaciones</MenuItem>}
        {notifs.map(n => (
          <MenuItem key={n.id} onClick={() => updateDoc(doc(db, "notificaciones", n.id), { read: true })}>
            <Typography variant="body2">{n.message}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
