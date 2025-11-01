#include <Wire.h>
#include <WiFi.h>
#include <WebServer.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
//#include <Firebase_ESP_Client.h>
/* Si Firebase no fuera posible (por límites o red):
Usar un intermediario, por ejemplo:

Cloud Function en Firebase

API en Render o Railway

o MQTT broker gratuito (como mqtt.eclipseprojects.io) */

// --- Configuración Wi-Fi ---
const char* ssid = "UTM";   // tu red WiFi
const char* password = "super222";  // tu contraseña

// --- Servidor Web ---
WebServer server(80);

// --- BME280 ---
Adafruit_BME280 bme;
#define SEALEVELPRESSURE_HPA (1013.25)

// --- PMS5003 ---
HardwareSerial pmsSerial(1);
#define PMS_RX 7
#define PMS_TX 6

struct pms5003data {
  uint16_t framelen;
  uint16_t pm10_standard, pm25_standard, pm100_standard;
  uint16_t pm10_env, pm25_env, pm100_env;
  uint16_t particles_03um, particles_05um, particles_10um, particles_25um, particles_50um, particles_100um;
  uint16_t unused;
  uint16_t checksum;
};

struct pms5003data data;

// --- Función JSON ---
void handleDataJSON() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  String json = "{";
  
  // BME280
  json += "\"sensor_temp\":\"TEMPERATURA\",";
  json += "\"temperature\":" + String(bme.readTemperature()) + ",";
  json += "\"humidity\":" + String(bme.readHumidity()) + ",";
  json += "\"pressure\":" + String(bme.readPressure() / 100.0F) + ",";
  
  // PMS5003
  json += "\"sensor_pm\":\"PM2.5\",";
  json += "\"pm25\":" + String(data.pm25_standard) + ",";
  json += "\"pm10\":" + String(data.pm100_standard);
  
  json += "}";
  server.send(200, "application/json", json);

  // También imprimir en Serial
  Serial.print("Temp: "); Serial.print(bme.readTemperature()); Serial.print(" °C, ");
  Serial.print("Hum: "); Serial.print(bme.readHumidity()); Serial.print(" %, ");
  Serial.print("PM2.5: "); Serial.print(data.pm25_standard); 
  Serial.print(", PM10: "); Serial.println(data.pm100_standard);
}

// --- Lectura PMS5003 ---
boolean readPMSdata(Stream *s) {
  if (!s->available()) return false;
  if (s->peek() != 0x42) { s->read(); return false; }
  if (s->available() < 32) return false;

  uint8_t buffer[32];
  uint16_t sum = 0;
  s->readBytes(buffer, 32);

  for (uint8_t i = 0; i < 30; i++) sum += buffer[i];

  uint16_t buffer_u16[15];
  for (uint8_t i = 0; i < 15; i++) {
    buffer_u16[i] = buffer[2 + i*2 + 1];
    buffer_u16[i] += (buffer[2 + i*2] << 8);
  }

  memcpy((void *)&data, (void *)buffer_u16, 30);

  if (sum != data.checksum) {
    Serial.println("Checksum failure");
    return false;
  }

  return true;
}

// --- Setup ---
void setup() {
  Serial.begin(115200);
  delay(1000);

  // Conectar Wi-Fi
  WiFi.begin(ssid, password);
  Serial.println("Conectando a Wi-Fi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi Conectado!");
  Serial.print("IP: "); Serial.println(WiFi.localIP());

  // Inicializar BME280
  Wire.begin(19, 18); // SDA = 19, SCL = 18
  if (!bme.begin(0x76, &Wire) && !bme.begin(0x77, &Wire)) {
    Serial.println("No se encontró BME280");
    while (1);
  }
  Serial.println("BME280 listo");

  // Inicializar PMS5003
  pmsSerial.begin(9600, SERIAL_8N1, PMS_RX, PMS_TX);
  Serial.println("Esperando PMS5003...");

  // Configurar servidor
  server.on("/data-json", handleDataJSON);
  server.begin();
  Serial.println("Servidor web iniciado en puerto 80");
}

// --- Loop ---
void loop() {
  server.handleClient();

  readPMSdata(&pmsSerial); // Actualiza estructura data
  delay(1000);
}