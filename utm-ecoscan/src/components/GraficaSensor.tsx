import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface GraficaSensorProps {
  datos: { timestamp: Date; valor: number }[];
  sensor: string;
}

const GraficaSensor: React.FC<GraficaSensorProps> = ({ datos, sensor }) => {
  // Convertimos datos a formato compatible
  const datosFormateados = datos.map(d => ({
    fecha: d.timestamp.toLocaleTimeString(), // Hora en formato legible
    valor: d.valor
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={datosFormateados}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="valor" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficaSensor;
