import { addDoc, collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { checkThreshold, db, pushNotificationForUser, useEffect, useState, type Lectura } from "../ui";
import { SENSORES, INTERVALO_LM5, API_URL } from "../constantes";

export function useLecturas(user: any, sensorActivo: string, fechaSeleccionada: Date | null) {
  const [lecturas, setLecturas] = useState<Lectura[]>([]);
  let intervalId: NodeJS.Timeout;
  const buscarPorFecha = async () => {
    console.log("Fecha actual:", fechaSeleccionada);
      if (!fechaSeleccionada) return;
      console.log("Se selecciono la fecha")
      const datos = await getLecturasPorDia(fechaSeleccionada)
      setLecturas(datos);
  };

  async function getLecturasPorDia (fecha: Date){
      const inicio = new Date (fecha);
      inicio.setHours(0,0,0,0);

      const fin = new Date (fecha);

      fin.setHours(23,59,59,999)

      const q = query (
          collection (db, "Lecturas del BM280"),
          where ("timestamp", ">=", Timestamp.fromDate(inicio)),
          where ("timestamp", "<=", Timestamp.fromDate(fin))
      );

      const querySnapshot = await getDocs(q);

      const resultadosConsulta : any []=[];

      querySnapshot.forEach(doc => {
          resultadosConsulta.push({id: doc.id,...doc.data()})
      });
        return resultadosConsulta
  }

useEffect(() => {
  const iniciarLectura = () => {
    if (sensorActivo === SENSORES.SIMULACION) {
      intervalId = setInterval(async () => {
        const sensores = [SENSORES.CO2, SENSORES.TEMPERATURA, SENSORES.PM25];
        const dataSimulada = {
        sensor: sensores[Math.floor(Math.random() * sensores.length)],
        valor: Math.floor(Math.random() * 10000),
        };
        const nuevaLectura: Lectura = {
        timestamp: Timestamp.now(),
        id: Date.now().toString(),
        sensor: dataSimulada.sensor,
        valor: dataSimulada.valor,
        };
        setLecturas((estadoAnterior) => 
          [...estadoAnterior, nuevaLectura]);
        const resultado = checkThreshold(nuevaLectura.sensor, 
          nuevaLectura.valor);
        if (resultado.level !== "ok") {
        await pushNotificationForUser(user.uid, {
        sensor: nuevaLectura.sensor,
        message: resultado.message,
        level: resultado.level,
        value: nuevaLectura.valor
        });
      }
      }, INTERVALO_LM5);
    }

    else if (sensorActivo === SENSORES.PM25) {
      intervalId = setInterval(async () => {
        console.log("leyendo sensor de partículas (PM2.5)...");
        const res = await fetch(API_URL);
        const data = await res.json();
        const nuevaLectura: Lectura = {
        timestamp: Timestamp.now(),
        id: Date.now().toString(),
        sensor: data.sensor,
        valor: data.pm25,
        };

        setLecturas((prev) => [...prev, nuevaLectura]);
        await addDoc(collection(db, "Lecturas del PM2.5"), {
        sensor: data.sensor,
        valor: data.pm25,
        timestamp: nuevaLectura.timestamp,
        salon: "Salon A10",
        userId: user?.uid,
        });
      }, INTERVALO_LM5);
    }

    else if (sensorActivo === SENSORES.TEMPERATURA) {
      intervalId = setInterval(async () => {
        console.log("leyendo sensor de Temperatura...");
        const conexion = await fetch(API_URL);
        const dataBM280 = await conexion.json();
        const nuevaLecturaBM280: Lectura = {
        timestamp: Timestamp.now(),
        id: Date.now().toString(),
        sensor: dataBM280.sensor,
        valor: dataBM280.temperature,
        };
        setLecturas((prev) => [...prev, nuevaLecturaBM280]);
        await addDoc(collection(db, "Lecturas del BM280"), {
        sensor: dataBM280.sensor,
        valor: dataBM280.temperature,
        timestamp: nuevaLecturaBM280.timestamp,
        Lugar: "Morelia",
        userId: user?.uid,
        });
      }, INTERVALO_LM5);
    }
  };
  iniciarLectura();
  return () => {
    if (intervalId) clearInterval(intervalId);
    console.log("Se limpió el sensor anterior");
  };
}, [sensorActivo, user]);
return { lecturas, setLecturas, getLecturasPorDia, buscarPorFecha };
}

