import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export async function pushNotificationForUser(userId: string, payload: {
  sensor?: string;
  message: string;
  level: "info" | "warning" | "critical";
  value?: number;
}) {
  await addDoc(collection(db, "notificaciones"), {
    userId,
    sensor: payload.sensor || null,
    message: payload.message,
    level: payload.level,
    value: payload.value || null,
    timestamp: serverTimestamp(),
    read: false
  });
}
