// frontend/src/components/SnellenChart.vue
<template>
  <div class="test-container">
    <div class="connection-status" :class="{ connected: wsConnected }">
      {{ wsConnected ? '✅ Connected to server' : '❌ Not connected to server' }}
    </div>

    <div class="controls">
      <button @click="startTest" :disabled="isTestRunning || !wsConnected" class="btn start">
        Start Test
      </button>
      <button @click="stopTest" :disabled="!isTestRunning" class="btn stop">
        Stop Test
      </button>
    </div>

    <div v-if="isTestRunning" class="chart">
      <div class="letter-display">
        <h1 class="letter">{{ currentLetter }}</h1>
      </div>
      <p v-if="transcribedText" class="speech-output">You said: "{{ transcribedText }}"</p>
    </div>

    <div v-if="testResult" class="result">
      <h3>Test Completed</h3>
      <p><strong>Score:</strong> {{ testResult.score }}</p>
      <p><strong>Transcription:</strong> {{ testResult.text }}</p>
      <button @click="saveAndViewResults" class="btn save">Save & View All Results</button>
    </div>
    
    <div v-if="!isTestRunning && !testResult" class="instructions">
      <h3>Instructions:</h3>
      <ol>
        <li>Position yourself about 20 feet (6 meters) from the screen</li>
        <li>Click "Start Test" when you're ready</li>
        <li>Read the letters out loud as they appear</li>
        <li>The test will automatically progress through different sizes</li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useSnellenStore } from "../store";
import { useSpeechRecognition } from "../composables/useSpeechRecognition";

const router = useRouter();
const snellenStore = useSnellenStore();

const ws = ref(null);
const isTestRunning = ref(false);
const testResult = ref(null);
const currentLetter = ref(""); 
const transcribedText = ref(""); 
const wsConnected = ref(false);

let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

// Speech Recognition Setup
const recognition = useSpeechRecognition((text) => {
  transcribedText.value = text;
  console.log("🎤 Recognized Speech:", text);
  
  // Send recognized speech to backend
  if (ws.value && ws.value.readyState === WebSocket.OPEN) {
    ws.value.send(JSON.stringify({ type: "speech_input", text }));
  }
});

function startTest() {
  if (!wsConnected.value) {
    console.error("WebSocket not connected!");
    alert("Cannot start test: Not connected to server. Please refresh and try again.");
    return;
  }
  
  if (ws.value && ws.value.readyState === WebSocket.OPEN) {
    ws.value.send(JSON.stringify({ type: "start_test" }));
    isTestRunning.value = true;
    testResult.value = null;
    transcribedText.value = ""; 
    currentLetter.value = "🔄 Initializing test...";
    console.log("🎙️ Test started: Sent start_test to server");

    // Start speech recognition
    try {
      recognition.start();
    } catch (err) {
      console.error("Speech recognition error:", err);
    }
  } else {
    alert("Cannot connect to server. Please check your connection and try again.");
  }
}

function stopTest() {
  if (ws.value && ws.value.readyState === WebSocket.OPEN) {
    ws.value.send(JSON.stringify({ type: "stop_test" }));
    isTestRunning.value = false;
    console.log("🛑 Test stopped: Sent stop_test to server");

    // Stop speech recognition
    try {
      recognition.stop();
    } catch (err) {
      console.error("Speech recognition stop error:", err);
    }
  }
}

function saveAndViewResults() {
  if (testResult.value) {
    snellenStore.setLatestResult(testResult.value);
    router.push("/results");
  }
}

function connectWebSocket() {
  const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:5050";
  console.log(`Connecting to WebSocket at ${wsUrl}, attempt ${reconnectAttempts + 1}...`);
  
  try {
    ws.value = new WebSocket(wsUrl);

    ws.value.onopen = () => {
      console.log("✅ WebSocket connected to backend");
      wsConnected.value = true;
      reconnectAttempts = 0;
      ws.value.send(JSON.stringify({ type: "frontend" })); // Register as frontend
    };

    ws.value.onmessage = (event) => {
      if (!event.data) return;

      try {
        const data = JSON.parse(event.data);
        console.log("📩 Message from backend:", data);

        if (data.type === "connection_confirmed") {
          console.log("🔗 Connection confirmed by server");
        } else if (data.type === "letter_update") {
          currentLetter.value = data.letter;
          console.log("Updated current letter to:", data.letter);
        } else if (data.type === "result") {
          testResult.value = {
            score: data.score,
            text: data.text,
          };
          isTestRunning.value = false;
          transcribedText.value = ""; // Clear after test
          
          // Stop speech recognition if it's still running
          try {
            recognition.stop();
          } catch (err) {
            // Ignore if already stopped
          }
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.value.onclose = (event) => {
      console.log("❌ WebSocket disconnected", event.code, event.reason);
      wsConnected.value = false;
      
      // Attempt to reconnect if not exceeding max attempts
      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        const timeout = Math.min(1000 * reconnectAttempts, 5000);
        console.log(`Attempting to reconnect in ${timeout}ms...`);
        setTimeout(connectWebSocket, timeout);
      } else {
        console.error("Max reconnection attempts reached. Please refresh the page.");
      }
    };
    
    ws.value.onerror = (error) => {
      console.error("WebSocket error:", error);
      wsConnected.value = false;
    };
  } catch (error) {
    console.error("Failed to create WebSocket connection:", error);
    wsConnected.value = false;
    
    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++;
      setTimeout(connectWebSocket, 2000);
    }
  }
}

// Monitor WebSocket connection
watch(wsConnected, (connected) => {
  console.log("WebSocket connection state changed:", connected ? "Connected" : "Disconnected");
  
  if (!connected && isTestRunning.value) {
    isTestRunning.value = false;
    alert("Connection to server lost. Test has been stopped.");
    
    // Stop speech recognition if it's still running
    try {
      recognition.stop();
    } catch (err) {
      // Ignore if already stopped
    }
  }
});

onMounted(() => {
  connectWebSocket();
});

onUnmounted(() => {
  if (ws.value) {
    ws.value.close();
  }
  
  // Make sure speech recognition is stopped
  try {
    recognition.stop();
  } catch (err) {
    // Ignore if already stopped
  }
});
</script>

<style scoped>
.test-container {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.connection-status {
  padding: 8px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  background-color: #ffebee;
  color: #c62828;
  display: inline-block;
}

.connection-status.connected {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.controls {
  margin-bottom: 30px;
}

.btn {
  margin: 10px;
  padding: 12px 24px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn:not(:disabled):hover {
  transform: translateY(-2px);
}

.start {
  background-color: #42b983;
  color: white;
}

.stop {
  background-color: #e74c3c;
  color: white;
}

.save {
  background-color: #3498db;
  color: white;
}

.chart {
  margin-top: 30px;
}

.letter-display {
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.letter {
  font-size: 100px;
  font-weight: bold;
  margin: 0;
  line-height: 1.2;
}

.speech-output {
  font-size: 18px;
  margin-top: 15px;
  color: #333;
  font-style: italic;
}

.result {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.instructions {
  margin-top: 30px;
  text-align: left;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 12px;
}

.instructions h3 {
  margin-top: 0;
}

.instructions ol {
  padding-left: 20px;
}

.instructions li {
  margin-bottom: 10px;
}
</style>