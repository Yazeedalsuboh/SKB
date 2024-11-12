# SeaLution Project
## Overview
The SeaLution project aims to design and develop a self-sustaining, capsule-shaped device capable of collecting vital marine ecosystem data. This device is powered by solar energy and consists of both an Air Station (top level) and a Water Station (bottom level), each equipped with various sensors for data acquisition. The data is continuously transmitted to a Firebase database, where it can be accessed in real-time through a React-based web interface.

By integrating advanced sensors and wireless data transmission, SeaLution provides real-time environmental monitoring of the air and water quality, offering valuable insights into marine ecosystems.

## Terminology

### Top Level (Air Station):

AQI Sensor: Monitors air quality by measuring pollutants such as particulate matter (PM).
DHT22 Sensor: Collects humidity and temperature data from the surrounding air.

### Bottom Level (Water Station):

TDS Sensor: Measures the total dissolved solids (TDS) in seawater, indicating the water quality.
DS18B20 Sensor: Captures precise water temperature readings.

### Arduino Rev4:

An Arduino Rev4 module is used to handle data acquisition from sensors and transmit it over Wi-Fi to Firebase.

### Solar Panel:

A solar panel powers the Arduino board and ensures that the device operates sustainably.

### Wind Turbine:

A wind turbine installed at the top level measures the average wind speed through analog voltage output.

## Software
### Arduino Code:

Reads data from the Air and Water stations every 5 seconds.
Sends the aggregated data to Firebase every 30 seconds.

### React Web Application:

Fetches data from Firebase and displays a sample of the collected data.
Offers users the option to download the data in CSV format based on selected data types, such as air humidity or water quality.


## Data Flow

###  Data Collection:

Every 5 seconds, the Arduino Rev4 reads data from the sensors (AQI, DHT22, TDS, and DS18B20).

### Data Transmission:

Every 30 seconds, the aggregated data from the sensors is sent to Firebase over Wi-Fi.

### Web Interface:

A React-based website fetches the data from Firebase.
The user can view a sample of the collected data.
Users can select specific data (e.g., air humidity or water quality) to download in CSV format.
