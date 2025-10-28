// src/hooks/useDetallesLectura.js
import { useState } from "react";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "../ui";

export function useDetallesLectura() {
    type Detalle = {
    id: string;
    sensor: string;
    valor: number;
    timestamp?: any;
    };
  const [detalles, setDetalles] = useState<Detalle[]>([]);
  const [cargando, setCargando] = useState(false);

  // Buscar lecturas por fecha (puedes ajustar para buscar por ID si prefieres)
  const obtenerDetallesPorFecha = async (fecha: any) => {
    try {
      setCargando(true);

      const inicio = new Date(fecha);
      inicio.setHours(0, 0, 0, 0);

      const fin = new Date(fecha);
      fin.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, "Lecturas del BM280"),
        where("timestamp", ">=", Timestamp.fromDate(inicio)),
        where("timestamp", "<=", Timestamp.fromDate(fin))
      );

      const snapshot = await getDocs(q);
      const datos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Detalle[];

      setDetalles(datos);
    } catch (error) {
      console.error("Error al obtener los detalles:", error);
    } finally {
      setCargando(false);
    }
  };

  return { detalles, cargando, obtenerDetallesPorFecha };
}
