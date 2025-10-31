// src/componentes/DetallesLectura.jsx
import { useState } from "react";
import { useDetallesLectura } from "../hooks/useVerDetalles";

export function DetallesLectura() {
  const [fecha] = useState(new Date());
  const { detalles, cargando, obtenerDetallesPorFecha } = useDetallesLectura();

  const handleBuscar = () => {
    obtenerDetallesPorFecha(fecha);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Detalles de Lecturas</h2>

      <div className="flex gap-2 items-center mb-4">
        <button
          onClick={handleBuscar}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ver detalles
        </button>
      </div>

      {cargando ? (
        <p>Cargando...</p>
      ) : detalles.length > 0 ? (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Sensor</th>
              <th className="p-2 border">Valor</th>
              <th className="p-2 border">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {detalles.map((d) => (
              <tr key={d.id}>
                <td className="p-2 border">{d.sensor}</td>
                <td className="p-2 border">{d.valor}</td>
                <td className="p-2 border">
                  {d.timestamp?.toDate().toLocaleString?.() ?? "Sin fecha"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron lecturas para esa fecha.</p>
      )}
    </div>
  );
}
