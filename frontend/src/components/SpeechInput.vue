<!-- frontend/src/components/SpeechInput.vue -->
<template>
  <div class="speech-input-container">
    <div class="mic-status" :class="{ active: isListening }">
      <div class="mic-icon">🎤</div>
      <div class="status-text">{{ statusText }}</div>
    </div>
    
    <div class="controls">
      <button @click="startListening" :disabled="isListening" class="mic-button start">
        Start Listening
      </button>
      <button @click="stopListening" :disabled="!isListening" class="mic-button stop">
        Stop Listening
      </button>
    </div>
    
    <div v-if="transcript" class="transcript">
      <h3>You said:</h3>
      <p>"{{ transcript }}"</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useSpeechRecognition } from "../composables/useSpeechRecognition";

const props = defineProps({
  autoStart: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['transcription']);

const isListening = ref(false);
const transcript = ref('');
const error = ref(null);

// Status text based on listening state
const statusText = computed(() => {
  if (error.value) return `Error: ${error.value}`;
  if (isListening.value) return 'Listening...';
  return 'Ready';
});

// Initialize speech recognition with callback
const recognition = useSpeechRecognition((text) => {
  transcript.value = text;
  emit('transcription', text);
});

// Start speech recognition
function startListening() {
  try {
    recognition.start();
    isListening.value = true;
    error.value = null;
  } catch (err) {
    console.error('Failed to start speech recognition:', err);
    error.value = err.message || 'Failed to start speech recognition';
    isListening.value = false;
  }
}

// Stop speech recognition
function stopListening() {
  try {
    recognition.stop();
    isListening.value = false;
  } catch (err) {
    console.error('Failed to stop speech recognition:', err);
  }
}

// Clean up speech recognition when component is unmounted
onBeforeUnmount(() => {
  if (isListening.value) {
    try {
      recognition.stop();
    } catch (err) {
      // Ignore errors when stopping on unmount
    }
  }
});

// Auto-start speech recognition if prop is set
onMounted(() => {
  if (props.autoStart) {
    startListening();
  }
});
</script>

<style scoped>
.speech-input-container {
  margin: 20px 0;
  text-align: center;
}

.mic-status {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.mic-icon {
  font-size: 24px;
  margin-right: 10px;
  opacity: 0.7;
  transition: all 0.3s;
}

.mic-status.active .mic-icon {
  opacity: 1;
  transform: scale(1.2);
  color: #e74c3c;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.status-text {
  font-size: 16px;
  font-weight: bold;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.mic-button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.mic-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mic-button.start {
  background-color: #3498db;
  color: white;
}

.mic-button.stop {
  background-color: #e74c3c;
  color: white;
}

.mic-button:not(:disabled):hover {
  transform: translateY(-2px);
}

.transcript {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  max-width: 500px;
  margin: 0 auto;
}

.transcript h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
  color: #666;
}

.transcript p {
  margin: 0;
  font-size: 18px;
  font-style: italic;
}
</style>