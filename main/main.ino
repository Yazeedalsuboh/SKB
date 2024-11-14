// Our overall system consists of Arduino components, a server component, and client component.
// The server and client component are included in the photos and videos of the build process section.


#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>
#include <MQUnifiedsensor.h>
#include "OneWire.h"
#include "DallasTemperature.h"
#include <WiFi.h>
#include <WiFiClient.h>
#include <ArduinoHttpClient.h>
#include <ArduinoJson.h>


// ********* PINS ********* //

  #define DHT_PIN 7
  #define MQ_PIN A0
  #define TDS_PIN A1
  #define DS_PIN A3
  #define FAN_PIN A5
  #define cycle 1000  // Delay between loops (in milliseconds)

// ********* PINS ********* //


// ********* WIFI ********* //
  const char* ssid = ""; 
  const char* password = "";
  const char* serverAddress = ""; // localhost address of the server
  const int serverPort = 4000; // port of the server

  WiFiClient wifi;
  HttpClient client = HttpClient(wifi, serverAddress, serverPort);
// ********* WIFI ********* //

// ********* DHT22 ********* //
  #define DHTTYPE DHT22   
  DHT dht(DHT_PIN, DHTTYPE);
// ********* DHT22 ********* //

// ********* MQ135 ********* //
  #define Board "Arduino UNO"
  #define Voltage_Resolution 5    // Reference voltage for sensor in volts
  #define Sensor_Type "MQ-135"
  #define ADC_Bit_Resolution 10   // 10-bit ADC resolution for Arduino UNO
  #define RatioMQ135CleanAir 3.6  // Ratio for clean air calibration (constant)
  MQUnifiedsensor MQ135(Board, Voltage_Resolution, ADC_Bit_Resolution, MQ_PIN, Sensor_Type);
// ********* MQ135 ********* //

// ********* TDS ********* //
  const float VREF = 5.0;               // Reference voltage for TDS sensor
  const float CALIBRATION_FACTOR = 0.5; // Calibration factor to offset TDS value
  const float CONVERSION_FACTOR = 133.42; // Converts voltage to TDS in ppm
// ********* TDS ********* //

// ********* DS ********* //
  OneWire oneWire(DS_PIN);
  DallasTemperature sensors(&oneWire);
// ********* DS ********* //

// ********* FAN ********* //
  const float maxVoltage = 5.0;       // ADC max voltage for fan
  const float turbineMaxVoltage = 7.2; // Max voltage output from the fan's turbine
  const float maxWindSpeed = 15;      // Corresponding max wind speed for 7.2V turbine
  const float normalizationFactor = 10; // Lower bound for valid fan ADC readings
// ********* FAN ********* //

StaticJsonDocument<200> payload;
StaticJsonDocument<200> data;
int loopsTillSensors = 20;            // Number of loops before data is sent
float ArrWindSpeed[5];                // Stores last 5 wind speed values

void setup() {
  Serial.begin(9600);
  payload["payload"] = payload.createNestedArray("payload");

  // ********* WIFI ********* //
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      delay(1000);
      Serial.println("Connecting to WiFi...");
    }
    Serial.println("Connected to WiFi");
  // ********* WIFI ********* //

  // ********* DHT ********* //
    dht.begin();
  // ********* DHT ********* //

  // ********* MQ ********* //
    MQ135.setRegressionMethod(1);  // Set regression for calculating ppm
    MQ135.setA(110.47);            // Parameters for MQ-135 gas sensor formula
    MQ135.setB(-2.862);
    MQ135.init();

    float calcR0 = 0;
    for (int i = 1; i <= 10; i++) {  // Calibration by averaging 10 readings
      MQ135.update();
      calcR0 += MQ135.calibrate(RatioMQ135CleanAir);
    }
    MQ135.setR0(calcR0 / 10);        // Set R0 after calibration
  // ********* MQ ********* //

  // ********* TDS ********* //
    pinMode(TDS_PIN, INPUT);        
  // ********* TDS ********* //

  // ********* DS ********* //
    sensors.begin();
  // ********* DS ********* //
}

void loop() {
  if (loopsTillSensors % 5 == 0) {
    data = {};  // Clear the previous data payload
    long randomId = random(100000, 999999);  // Generate random ID for this data batch
    data["id"] = randomId;

    // ********* DHT22 ********* //
      float h = dht.readHumidity();
      float t = dht.readTemperature();
      data["air_humidity_rh"] = h;
      data["air_temp_c"] = t;
      data["air_heat_index_c"] = dht.computeHeatIndex(t, h, false); // Calculated heat index
    // ********* DHT22 ********* //

    // ********* MQ 135 ********* //
      MQ135.update();
      float ppm = MQ135.readSensor();   // Get air quality in ppm
      data["air_quality_ppm"] = ppm; 
    // ********* MQ 135 ********* //

    // ********* TDS ********* //
      int sensorValue = analogRead(TDS_PIN);  // Read TDS sensor value
      float voltage = (sensorValue / 1024.0) * VREF; // Convert ADC value to voltage
      float tds = (voltage - CALIBRATION_FACTOR) * CONVERSION_FACTOR; 
      tds = max(tds, 0);   // Ensure TDS is non-negative

      data["water_tds_ppm"] = tds;  // TDS level in ppm
    // ********* TDS ********* //

    // ********* DS ********* //
      sensors.requestTemperatures();
      float tempC = sensors.getTempCByIndex(0); // Read temperature from DS sensor

      data["water_ds_c"] = tempC; 
    // ********* DS ********* //
  }

  // ********* FAN ********* //
    int fan_value = analogRead(FAN_PIN); // Read fan turbine sensor value

    if (fan_value < normalizationFactor) fan_value = 0; // Ignore small values as noise

    float fan_voltage = (fan_value / 1023.0) * maxVoltage;  // Convert ADC to voltage
    float windSpeed = (fan_voltage / turbineMaxVoltage) * maxWindSpeed; // Voltage to wind speed

    ArrWindSpeed[loopsTillSensors % 5] = windSpeed; // Store in array for averaging
  // ********* FAN ********* //

  // ********* WIFI ********* //
    if (loopsTillSensors % 5 == 0) {
      float windSpeedAverage = 0;
      for (int i = 0; i < 5; i++) windSpeedAverage += ArrWindSpeed[i]; // Calculate avg wind speed
      data["wind_speed"] = windSpeedAverage / 5; 

      payload["payload"].as<JsonArray>().add(data); // Add data to payload array
    }

    if (!loopsTillSensors) { // Send data every 20 loops
      String postData;
      serializeJson(payload, postData);

      Serial.println("Sending POST request with JSON data");

      client.beginRequest();
      client.post("/");
      client.sendHeader("Content-Type", "application/json");
      client.sendHeader("Content-Length", postData.length());
      client.beginBody();
      client.print(postData);
      client.endRequest();

      int statusCode = client.responseStatusCode();
      String response = client.responseBody();

      Serial.println("Status code: " + String(statusCode));
      Serial.println("Response: " + response);

      payload.clear(); // Clear payload for the next batch
      payload["payload"] = payload.createNestedArray("payload");
      data.clear();
      loopsTillSensors = 20; // Reset counter

      Serial.print("data sent loopsTillSensors:");
      Serial.println(loopsTillSensors);

    } else {
      Serial.print("data saved loopsTillSensors:");
      Serial.println(loopsTillSensors);
      loopsTillSensors -= 1;
    }
  // ********* WIFI ********* //

  delay(cycle); 
}
