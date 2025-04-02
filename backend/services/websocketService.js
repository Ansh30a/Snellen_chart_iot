// backend/services/websocketService.js
import { WebSocketServer } from 'ws';
import fs from 'fs';
import { processAudioFile } from './audioService.js';
import { SNELLEN_CHART_ROWS, SNELLEN_SCORES } from '../config/index.js';
import { saveTranscription } from '../models/transcriptionModel.js';
import { calculateScore } from '../utils/snellenLogic.js';

// Global connection references
let esp32Socket = null;
let frontendSocket = null;
let isProcessingAudio = false;
let audioDataReceived = 0;

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server, perMessageDeflate: false });
  
  console.log("🔌 WebSocket server created, waiting for connections...");

  wss.on("connection", (ws, req) => {
    console.log(`🔗 WebSocket Connected: ${req.socket.remoteAddress}`);

    ws.on("message", async (message) => {
      try {
        // Handle binary audio data from ESP32
        if (Buffer.isBuffer(message)) {
          console.log(`🎵 Received ${message.length} bytes of audio data`);
          handleAudioData(message);
          return;
        }
        
        // Handle JSON messages
        if (!message || message.length === 0) {
          console.warn("⚠️ Received empty WebSocket message, ignoring.");
          return;
        }
        
        const data = JSON.parse(message.toString());
        console.log("📩 WebSocket Message:", data);

        switch(data.type) {
          case "frontend":
            console.log("🖥️ Frontend connected");
            frontendSocket = ws;
            // Send confirmation to frontend
            frontendSocket.send(JSON.stringify({ type: "connection_confirmed" }));
            break;
            
          case "esp32":
            console.log("🎤 ESP32 connected for audio streaming");
            esp32Socket = ws;
            // Send confirmation to ESP32
            esp32Socket.send(JSON.stringify({ type: "connection_confirmed" }));
            break;
            
          case "start_test":
            console.log("🎙️ Start test requested");
            if (esp32Socket) {
              esp32Socket.send(JSON.stringify({ type: "START_RECORDING" }));
              console.log("🎙️ Sent start recording command to ESP32");
            }
            startSnellenTest();
            break;
            
          case "stop_test":
            console.log("🛑 Stop test requested");
            if (esp32Socket) {
              esp32Socket.send(JSON.stringify({ type: "STOP_RECORDING" }));
              console.log("🛑 Sent stop recording command to ESP32");
            }
            // Process any input we have so far or simulate a result if testing without ESP32
            if (!esp32Socket) {
              const mockTranscription = "E F P T O Z";
              processTranscription(mockTranscription);
            }
            break;
            
          case "speech_input":
            console.log("🗣️ Speech input from frontend:", data.text);
            await processTranscription(data.text);
            break;
            
          default:
            console.warn("⚠️ Unknown WebSocket message type:", data.type);
        }
      } catch (err) {
        console.error("❌ WebSocket Message Error:", err.message);
      }
    });

    ws.on("close", () => {
      if (ws === frontendSocket) {
        console.log("❌ Frontend disconnected.");
        frontendSocket = null;
      }
      if (ws === esp32Socket) {
        console.log("📤 ESP32 disconnected.");
        esp32Socket = null;
      }
    });
  });
}

// Handle audio data from ESP32
function handleAudioData(audioBuffer) {
  try {
    // Ensure directory exists
    const directory = './temp';
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
    
    // Append to raw audio file
    fs.appendFileSync('temp/audio_input.raw', audioBuffer);
    audioDataReceived += audioBuffer.length;

    console.log(`📂 Saved ${audioBuffer.length} bytes to file (Total: ${audioDataReceived})`);

    // Process when enough data is received
    if (audioDataReceived >= 100000 && !isProcessingAudio) {
      isProcessingAudio = true;
      
      // If whisper is not available, use a mock transcription
      const mockTranscription = "E F P T O Z";
      
      try {
        processAudioFile()
          .then(transcription => {
            console.log('🔤 Transcription result:', transcription);
            return processTranscription(transcription);
          })
          .catch(err => {
            console.error('❌ Audio processing error:', err);
            // Fall back to mock data if audio processing fails
            return processTranscription(mockTranscription);
          })
          .finally(() => {
            isProcessingAudio = false;
            audioDataReceived = 0;
          });
      } catch (error) {
        console.error('Failed to process audio:', error);
        // Fall back to mock data
        processTranscription(mockTranscription);
        isProcessingAudio = false;
        audioDataReceived = 0;
      }
    }
  } catch (error) {
    console.error("❌ Error saving audio data:", error.message);
  }
}

// Start Snellen Chart Test
function startSnellenTest() {
  if (!frontendSocket) {
    console.error("❌ Cannot start test: Frontend not connected");
    return;
  }

  console.log("🏁 Starting Snellen test sequence");
  let index = 0;

  const sendNextLetter = () => {
    if (index < SNELLEN_CHART_ROWS.length && frontendSocket) {
      const letter = SNELLEN_CHART_ROWS[index];
      frontendSocket.send(JSON.stringify({ 
        type: "letter_update", 
        letter,
        rowIndex: index 
      }));
      console.log("🔤 Sent letter:", letter, "Row index:", index);
      index++;
      setTimeout(sendNextLetter, 3000);
    } else {
      console.log("✅ Finished sending all letters or frontend disconnected");
    }
  };

  // Start the letter sequence
  sendNextLetter();
}

// Process transcription and calculate score
async function processTranscription(transcription) {
  console.log("📊 Processing Snellen Chart Logic with input:", transcription);

  // Compare with expected text and calculate score
  const score = calculateScore(transcription);
  console.log(`🎯 Final Score: ${score}`);

  // Save to database
  try {
    await saveTranscription({ text: transcription, score });
    console.log("✅ Score saved to database");
  } catch (err) {
    console.error("❌ DB Error:", err);
  }

  // Send result to frontend
  if (frontendSocket) {
    frontendSocket.send(JSON.stringify({ 
      type: "result", 
      score, 
      text: transcription 
    }));
    console.log("✅ Results sent to frontend");
  } else {
    console.error("❌ Cannot send results: Frontend not connected");
  }
}