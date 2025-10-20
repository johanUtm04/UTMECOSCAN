/* import { useState, useEffect } from "react";
import type { Lectura } from "../ui";

export function useLecturaSeleccionada(lecturaSeleccionada: Lectura | null) {
  const [detalles, setDetalles] = useState<Lectura | null>(null);

  // useEffect se dispara cada vez que cambia lecturaSeleccionada
  useEffect(() => {
    console.log(lecturaSeleccionada);
    if(!lecturaSeleccionada) return;
    if (lecturaSeleccionada) {
      setDetalles(lecturaSeleccionada);
      console.log("Detalles actualizados:", lecturaSeleccionada);
    }
  }, [lecturaSeleccionada]);

  return { detalles };
}
 */