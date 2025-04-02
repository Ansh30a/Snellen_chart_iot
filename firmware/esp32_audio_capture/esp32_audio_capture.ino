// firmware/esp32_audio_capture/esp32_audio_capture.ino

#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <driver/i2s.h>

// WiFi Credentials
const char* ssid = "Gareeb Kalyaan Yojna";
const char* password = "30303030";

// WebSocket Server details
const char* websocket_server = "192.168.164.63"; // Replace with your server's IP
const uint16_t websocket_port = 5050;

// I2S Configuration for INMP441 microphone
#define I2S_WS_PIN 15
#define I2S_SCK_PIN 14
#define I2S_SD_PIN 32
#define I2S_PORT I2S_NUM_0
#define BUFFER_SIZE 1024

WebSocketsClient webSocket;
bool isRecording = false;
unsigned long lastHeartbeat = 0;

// Buffer for audio data
int16_t sBuffer[BUFFER_SIZE];

void setup() {
  Serial.begin(115200);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi...");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.print("Connected to WiFi, IP address: ");
  Serial.println(WiFi.localIP());
  
  // Initialize I2S for the INMP441 microphone
  initI2S();
  
  // Setup WebSocket connection
  setupWebSocket();
}

void loop() {
  webSocket.loop();
  
  // Handle recording if active
  if (isRecording) {
    recordAndSendAudio();
  }
  
  // Send heartbeat message every 30 seconds
  unsigned long currentMillis = millis();
  if (currentMillis - lastHeartbeat > 30000) {
    sendHeartbeat();
    lastHeartbeat = currentMillis;
  }
}

void initI2S() {
  Serial.println("Configuring I2S...");
  
  // I2S configuration for INMP441 microphone
  const i2s_config_t i2s_config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
    .sample_rate = 16000,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
    .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = I2S_COMM_FORMAT_STAND_I2S,
    .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
    .dma_buf_count = 8,
    .dma_buf_len = BUFFER_SIZE,
    .use_apll = false,
    .tx_desc_auto_clear = false,
    .fixed_mclk = 0
  };
  
  // I2S pin configuration
  const i2s_pin_config_t pin_config = {
    .bck_io_num = I2S_SCK_PIN,   // Serial Clock
    .ws_io_num = I2S_WS_PIN,     // Word Select (Left/Right Clock)
    .data_out_num = I2S_PIN_NO_CHANGE,  // Not used for input
    .data_in_num = I2S_SD_PIN    // Serial Data
  };
  
  // Install and start I2S driver
  esp_err_t result = i2s_driver_install(I2S_PORT, &i2s_config, 0, NULL);
  if (result != ESP_OK) {
    Serial.printf("Error installing I2S driver: %d\n", result);
    return;
  }
  
  result = i2s_set_pin(I2S_PORT, &pin_config);
  if (result != ESP_OK) {
    Serial.printf("Error setting I2S pins: %d\n", result);
    return;
  }
  
  Serial.println("I2S driver installed successfully");
}

void setupWebSocket() {
  // Server info
  Serial.println("Connecting to WebSocket server...");
  
  // Initialize WebSocket client
  webSocket.begin(websocket_server, websocket_port, "/");
  
  // Callbacks
  webSocket.onEvent(webSocketEvent);
  
  // Try to reconnect every 5 seconds if connection fails
  webSocket.setReconnectInterval(5000);
  
  // Optional: more logging
  // webSocket.enableHeartbeat(15000, 3000, 2);
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("WebSocket disconnected");
      isRecording = false;
      break;
      
    case WStype_CONNECTED:
      Serial.println("WebSocket connected");
      // Send device registration
      sendDeviceInfo();
      break;
      
    case WStype_TEXT:
      handleTextMessage(payload, length);
      break;
      
    case WStype_BIN:
      Serial.println("Binary message received (unexpected)");
      break;
      
    case WStype_ERROR:
      Serial.println("WebSocket error");
      break;
      
    case WStype_PING:
      Serial.println("Ping received");
      break;
      
    case WStype_PONG:
      Serial.println("Pong received");
      break;
  }
}

void handleTextMessage(uint8_t * payload, size_t length) {
  // Parse JSON message
  DynamicJsonDocument doc(1024);
  DeserializationError error = deserializeJson(doc, payload, length);
  
  if (error) {
    Serial.print("JSON parsing failed: ");
    Serial.println(error.c_str());
    return;
  }
  
  // Handle commands
  const char* type = doc["type"];
  if (type) {
    Serial.print("Received command: ");
    Serial.println(type);
    
    if (strcmp(type, "START_RECORDING") == 0) {
      startRecording();
    } else if (strcmp(type, "STOP_RECORDING") == 0) {
      stopRecording();
    }
  }
}

void sendDeviceInfo() {
  DynamicJsonDocument doc(200);
  doc["type"] = "esp32";
  doc["mac"] = WiFi.macAddress();
  doc["ip"] = WiFi.localIP().toString();
  
  String jsonStr;
  serializeJson(doc, jsonStr);
  
  webSocket.sendTXT(jsonStr);
  Serial.println("Device info sent to server");
}

void sendHeartbeat() {
  DynamicJsonDocument doc(100);
  doc["type"] = "heartbeat";
  doc["uptime"] = millis() / 1000;
  
  String jsonStr;
  serializeJson(doc, jsonStr);
  
  webSocket.sendTXT(jsonStr);
  Serial.println("Heartbeat sent");
}

void startRecording() {
  Serial.println("Starting audio recording");
  isRecording = true;
}

void stopRecording() {
  Serial.println("Stopping audio recording");
  isRecording = false;
}

void recordAndSendAudio() {
  size_t bytesRead = 0;
  esp_err_t result = i2s_read(I2S_PORT, &sBuffer, sizeof(sBuffer), &bytesRead, portMAX_DELAY);
  
  if (result == ESP_OK && bytesRead > 0) {
    // Only send if we actually read some data and WebSocket is connected
    if (webSocket.isConnected()) {
      webSocket.sendBIN((uint8_t*)sBuffer, bytesRead);
    }
  } else if (result != ESP_OK) {
    Serial.printf("I2S read error: %d\n", result);
  }
}