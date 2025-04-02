# Snellen Chart IoT Project

A digital vision testing system that combines IoT devices with web technologies to provide an automated Snellen chart eye test.

## Features

- Digital Snellen chart display with standardized letter sequences
- Audio capture from ESP32 microphone (INMP441)
- Speech-to-text processing using Whisper ASR
- Real-time communication via WebSockets
- Vision score calculation based on reading accuracy
- History of test results stored in MongoDB
- Responsive Vue.js frontend interface

## System Architecture

This project consists of three main components:

1. **Frontend**: Vue.js application for user interface
2. **Backend**: Node.js/Express server for processing and data management
3. **ESP32 Firmware**: Handles audio capture from the INMP441 microphone

## Setup Instructions

### Prerequisites

- Node.js v16+ and npm
- MongoDB
- Arduino IDE with ESP32 support
- ESP32 microcontroller with INMP441 I2S microphone
- FFmpeg installed on the server
- Whisper ASR installed on the server

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following content:
   ```
   PORT=5050
   MONGO_URI=mongodb://127.0.0.1:27017/snellen_chart
   ```

4. Start the server:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following content:
   ```
   VITE_API_BASE_URL=http://localhost:5050/api
   VITE_WS_URL=ws://localhost:5050
   ```

4. Start the development server:
   ```
   npm run dev
   ```

### ESP32 Setup

1. Open the Arduino IDE
2. Install the following libraries:
   - WebSocketsClient
   - ArduinoJson
3. Open the `esp32_audio_capture.ino` file
4. Update the WiFi credentials and server IP address
5. Upload the sketch to your ESP32 device

## Usage

1. Connect the ESP32 with the INMP441 microphone to power
2. Ensure the backend server is running
3. Open the frontend application in a web browser
4. Position yourself approximately 20 feet (6 meters) from the screen
5. Click "Start Test" to begin the vision test
6. Read the letters shown on the screen aloud
7. View your results at the end of the test

## License

This project is licensed under the MIT License - see the LICENSE file for details.
