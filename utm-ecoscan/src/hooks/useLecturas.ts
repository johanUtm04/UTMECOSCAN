import { addDoc, collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { checkThreshold, db, pushNotificationForUser, useEffect, useState, type Lectura } from "../ui";
import { SENSORES, INTERVALO_LM5, API_URL } from "../constantes";

export function useLecturas(user: any, sensorActivo: string, fechaSeleccionada: Date | null) {
  const [lecturas, setLecturas] = useState<Lectura[]>([]);
  let intervalId: NodeJS.Timeout;

  // Buscar lecturas por fecha
  const buscarPorFecha = async () => {
    console.log("Fecha actual:", fechaSeleccionada);
    if (!fechaSeleccionada) return;
    console.log("Se seleccionó la fecha");
    const datos = await getLecturasPorDia(fechaSeleccionada);
    setLecturas(datos);
  };

  // Obtener lecturas de Firebase por día
  async function getLecturasPorDia(fecha: Date) {
    const inicio = new Date(fecha);
    inicio.setHours(0, 0, 0, 0);

    const fin = new Date(fecha);
    fin.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, "lecturas simuladas"),
      where("timestamp", ">=", Timestamp.fromDate(inicio)),
      where("timestamp", "<=", Timestamp.fromDate(fin))
    );

    const querySnapshot = await getDocs(q);
    const resultadosConsulta: any[] = [];

    querySnapshot.forEach(doc => {
      resultadosConsulta.push({ id: doc.id, ...doc.data() });
    });

    return resultadosConsulta;
  }

  // Inicia la lectura de sensores
  useEffect(() => {
    const iniciarLectura = () => {
      if (sensorActivo === SENSORES.SIMULACION) {
        // Simulación de todos los sensores
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

          setLecturas(prev => [...prev, nuevaLectura]);
            setLecturas(prev => [...prev, nuevaLectura]);
            await addDoc(collection(db, "lecturas simuladas"), {
              sensor: dataSimulada.sensor,
              valor: dataSimulada.valor,
              timestamp: nuevaLectura.timestamp,
              salon: "Salon A10",
              userId: user?.uid,
            });
          const resultado = checkThreshold(nuevaLectura.sensor, nuevaLectura.valor);
          if (resultado.level !== "ok") {
            await pushNotificationForUser(user.uid, {
              sensor: nuevaLectura.sensor,
              message: resultado.message,
              level: resultado.level,
              value: nuevaLectura.valor
            });
          }
        }, INTERVALO_LM5);

      } else {
        // Lectura real de ESP32 (PM2.5 y Temperatura a la par)
        intervalId = setInterval(async () => {
          try {
            const res = await fetch(API_URL);
            const data = await res.json();

            // Lectura de Temperatura
            const lecturaTemp: Lectura = {
              timestamp: Timestamp.now(),
              id: Date.now().toString() + "-temp",
              sensor: data.sensor_temp,
              valor: data.temperature,
            };
            setLecturas(prev => [...prev, lecturaTemp]);
            await addDoc(collection(db, "Lecturas del BM280"), {
              sensor: data.sensor_temp,
              valor: data.temperature,
              timestamp: lecturaTemp.timestamp,
              Lugar: "Morelia",
              userId: user?.uid,
            });

            // Lectura de PM2.5
            const lecturaPM: Lectura = {
              timestamp: Timestamp.now(),
              id: Date.now().toString() + "-pm",
              sensor: data.sensor_pm,
              valor: data.pm25,
            };
            setLecturas(prev => [...prev, lecturaPM]);
            await addDoc(collection(db, "Lecturas del PM2.5"), {
              sensor: data.sensor_pm,
              valor: data.pm25,
              timestamp: lecturaPM.timestamp,
              salon: "Salon A10",
              userId: user?.uid,
            });

          } catch (error) {
            console.error("Error al leer los sensores:", error);
          }
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
