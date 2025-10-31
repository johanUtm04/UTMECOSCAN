import { addDoc, collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { checkThreshold, db, pushNotificationForUser, useEffect, useState, type Lectura } from "../ui";
import { SENSORES, INTERVALO_LM5, API_URL } from "../constantes";

export function useLecturas(user: any, sensorActivo: string, fechaSeleccionada: Date | null) {
  //Variables constantes de la funcion
  const [lecturas, setLecturas] = useState<Lectura[]>([]);
  let intervalId: NodeJS.Timeout;

  //Funcion para buscar por fecha
  const buscarPorFecha = async () => {
    if (!fechaSeleccionada) return;
    console.log("Se seleccionó la fecha");
    const datos = await getLecturasPorDia(fechaSeleccionada);
    setLecturas(datos);
  };

  //Funcion Asyncrona para buscar en la DB
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

  //Funcion para iniciar la lectura de sensores (Simulacion, PM2.5 O TEMPERARURA)
  useEffect(() => {
    const iniciarLectura = () => {
      console.log("Sensor activo actual:", sensorActivo);

      //En caso de ser un Simulacion--
      if (sensorActivo === SENSORES.SIMULACION) {
        intervalId = setInterval(async () => {
          try {
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
            await addDoc(collection(db, "lecturas simuladas"), {
              sensor: dataSimulada.sensor,
              valor: dataSimulada.valor,
              timestamp: nuevaLectura.timestamp,
              salon: "Sala de Maestros",
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
          console.log("Funciono El sensor de -SIMULACION-")
          } catch (error) {
          console.error("Error al leer sensor de Pruebas:", error);
          }
        }, INTERVALO_LM5);
      }
      
        //En caso de ser de particulas de polvo-- 
        else if(sensorActivo === SENSORES.PM25){
        intervalId = setInterval(async () => {
          try {
            const res = await fetch(API_URL);
            const data = await res.json();

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

            const resultado = checkThreshold(lecturaPM.sensor, lecturaPM.valor);
            if (resultado.level !== "ok") {
              await pushNotificationForUser(user.uid, {
                sensor: lecturaPM.sensor,
                message: resultado.message,
                level: resultado.level,
                value: lecturaPM.valor
              });
            }
            console.log("Funciono El sensor de -PM-")
          } catch (error) {
            console.error("Error al leer sensor de PM2.5:", error);
          }
          
        }, INTERVALO_LM5);
      }
      
      //En caso de ser de la temperatura-- 
      else if(sensorActivo === SENSORES.TEMPERATURA){
        intervalId = setInterval(async () => {
          try {
            const res = await fetch(API_URL);
            const data = await res.json();

            // Lectura de BM280
            const lecturaBM280: Lectura = {
              timestamp: Timestamp.now(),
              id: Date.now().toString() + "-temp",
              sensor: data.sensor_temp,
              valor: data.temperature,
            };
            setLecturas(prev => [...prev, lecturaBM280]);
            await addDoc(collection(db, "Lecturas del BM280"), {
              sensor: data.sensor_temp,
              valor: data.temperature,
              timestamp: lecturaBM280.timestamp,
              salon: "Sala de Maestros",
              userId: user?.uid,
            });

            const resultado = checkThreshold(lecturaBM280.sensor, lecturaBM280.valor);
            if (resultado.level !== "ok") {
              await pushNotificationForUser(user.uid, {
                sensor: lecturaBM280.sensor,
                message: resultado.message,
                level: resultado.level,
                value: lecturaBM280.valor
              });
            }
            console.log("Funciono El sensor de -TEMPERATURA-")

          } catch (error) {
            console.error("Error al leer sensor de Temperatura", error);
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
