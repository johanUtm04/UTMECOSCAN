export type AlertLevel = "ok" | "info" | "warning" | "critical";

export function checkThreshold(sensor: string, value: number): { level: AlertLevel; message: string } {
  if (sensor === "CO2") {
    if (value <= 600) return { level: "ok", message: "CO₂ en rango bueno" };
    if (value <= 1000) return { level: "info", message: `CO₂ aceptable: ${value} ppm` };
    if (value <= 1500) return { level: "warning", message: `CO₂ malo: ${value} ppm` };
    return { level: "critical", message: `CO₂ peligroso: ${value} ppm` };
  }

  if (sensor === "PM2.5") {
    if (value <= 12) return { level: "ok", message: "PM2.5 en rango bueno" };
    if (value <= 35) return { level: "info", message: `PM2.5 aceptable: ${value} µg/m³` };
    if (value <= 55) return { level: "warning", message: `PM2.5 dañino: ${value} µg/m³` };
    return { level: "critical", message: `PM2.5 peligroso: ${value} µg/m³` };
  }

  if (sensor === "TEMPERATURA") {
    if (value >= 18 && value <= 24) return { level: "ok", message: `Temperatura confort: ${value}°C` };
    if ((value >= 15 && value < 18) || (value > 24 && value <= 27)) return { level: "info", message: `Temperatura aceptable: ${value}°C` };
    if ((value < 15 && value >= 0) || (value > 27 && value <= 30)) return { level: "warning", message: `Temperatura incómoda: ${value}°C` };
    return { level: "critical", message: `Temperatura peligrosa: ${value}°C` };
  }

  return { level: "ok", message: `${sensor}: ${value}` };
}
