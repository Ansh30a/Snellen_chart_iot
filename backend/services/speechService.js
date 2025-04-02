// backend/services/speechService.js
import { spawn } from 'child_process';
import { AUDIO_FILE_WAV } from '../config/index.js';
import { processAudioFile } from './audioService.js';

// Process speech input from the frontend
export function processSpeechInput(text) {
  return new Promise((resolve) => {
    // Convert text to uppercase for consistency with the Snellen chart
    const normalizedText = text.trim().toUpperCase();
    console.log("🔤 Normalized speech input:", normalizedText);
    resolve(normalizedText);
  });
}

// Process audio stream from the ESP32 microphone
export async function processAudioStream(audioBuffer) {
  try {
    // Use the audio service to process the raw audio data
    const transcription = await processAudioFile();
    console.log("🎙️ Audio stream processed:", transcription);
    return transcription;
  } catch (error) {
    console.error("❌ Error processing audio stream:", error);
    throw error;
  }
}

// Optional: Text-to-speech functionality for accessibility
export function textToSpeech(text) {
  return new Promise((resolve, reject) => {
    // This could be implemented with various TTS engines
    // Example using espeak (if installed on the server)
    const process = spawn('espeak', [text]);
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve(true);
      } else {
        reject(new Error(`Text-to-speech process exited with code ${code}`));
      }
    });
    
    process.on('error', (err) => {
      reject(err);
    });
  });
}