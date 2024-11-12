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

#define DHT_PIN 8
#define MQ_PIN A0
#define TDS_PIN A1
#define DS_PIN A3
#define cycle 5000

// ********* WIFI ********* //
  const char* ssid = "TP-LINK_5E6C";
  const char* password = "1234567890";
  const char* serverAddress = "192.168.0.102";
  const int serverPort = 4000;

  WiFiClient wifi;
  HttpClient client = HttpClient(wifi, serverAddress, serverPort);
// ********* WIFI ********* //

// ********* DHT22 ********* //
  #define DHTTYPE DHT22   
  DHT dht(DHT_PIN, DHTTYPE);
// ********* DHT22 ********* //

// ********* MQ135 ********* //
  #define Board "Arduino UNO"
  #define Voltage_Resolution 3.3
  #define Sensor_Type "MQ-135"
  #define ADC_Bit_Resolution 10 
  #define RatioMQ135CleanAir 3.6
  MQUnifiedsensor MQ135(Board, Voltage_Resolution, ADC_Bit_Resolution, MQ_PIN, Sensor_Type);
// ********* MQ135 ********* //

// ********* TDS ********* //
  const float VREF = 5.0;
  const float CALIBRATION_FACTOR = 0.5;
  const float CONVERSION_FACTOR = 133.42;
// ********* TDS ********* //

// ********* DS ********* //
  OneWire oneWire(DS_PIN);
  DallasTemperature sensors(&oneWire);
// ********* DS ********* //

StaticJsonDocument<200> payload;
int loopsTillPost = 4;

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
    MQ135.setRegressionMethod(1);
    MQ135.setA(110.47);          
    MQ135.setB(-2.862);        
    MQ135.init();

    float calcR0 = 0;
    for (int i = 1; i <= 10; i++) {
      MQ135.update();
      calcR0 += MQ135.calibrate(RatioMQ135CleanAir);
    }
    MQ135.setR0(calcR0 / 10);
  // ********* MQ ********* //

  // ********* TDS ********* //
    pinMode(TDS_PIN, INPUT);
  // ********* TDS ********* //

  // ********* DS ********* //
    sensors.begin();
  // ********* DS ********* //
}



void loop() {
  StaticJsonDocument<200> data;

  long randomId = random(100000, 999999);
  data["id"] = randomId;

  // ********* DHT22 ********* //
    float h = dht.readHumidity();
    float t = dht.readTemperature();

    data["air_humidity"] = h; //$$_rh
    data["air_temp_c"] = t;
    data["air_heat_index_c"] = dht.computeHeatIndex(t, h, false);
  // ********* DHT22 ********* //
  
  // ********* MQ 135 ********* //
    MQ135.update();
    float ppm = MQ135.readSensor();
    data["air_quality"] = ppm; //$$_ppm
  // ********* MQ 135 ********* //
  
  // ********* TDS ********* //
    int sensorValue = analogRead(TDS_PIN); 
    float voltage = (sensorValue / 1024.0) * VREF; 
    float tds = (voltage - CALIBRATION_FACTOR) * CONVERSION_FACTOR; 
    tds = max(tds, 0);
    
    data["water_tds"] = tds;
  // ********* TDS ********* //

  // ********* DS ********* //
    sensors.requestTemperatures();
    float tempC = sensors.getTempCByIndex(0); 
    
    data["water_ds"] = tempC; //$$c
  // ********* DS ********* //

  // ********* WIFI ********* //
    payload["payload"].as<JsonArray>().add(data);
    if (!loopsTillPost) {
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
  
      payload.clear();
      payload["payload"] = payload.createNestedArray("payload");
      data.clear();
      loopsTillPost = 4;

      Serial.print("data sent loopsTillPost:");
      Serial.println(loopsTillPost);
    
    } else {
      Serial.print("data saved loopsTillPost:");
      Serial.println(loopsTillPost);
      loopsTillPost -= 1;

    }

  // ********* WIFI ********* //
  
  delay(cycle);
}
