//Importaciones

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";


//Molde que necesita la grafica
interface GraficaSensorProps {
  datos: { timestamp: Date; valor: number }[];
  sensor: string;
}

//Declaramos el componente
function GraficaSensor({datos}:GraficaSensorProps){
  const datosFormateados = datos.map(d => ({
    fecha: d.timestamp.toLocaleTimeString(),
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
