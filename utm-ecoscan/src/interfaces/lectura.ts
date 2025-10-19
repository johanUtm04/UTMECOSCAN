import type { Timestamp } from "firebase/firestore";

export interface Lectura {
  timestamp: Timestamp;
  id: string;
  sensor: string;
  valor: number;
}

