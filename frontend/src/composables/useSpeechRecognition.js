// frontend/src/composables/useSpeechRecognition.js

export function useSpeechRecognition(callback) {
  // Check if the browser supports the SpeechRecognition API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    console.error('Speech recognition not supported in this browser');
    // Return a mock object with the same interface but that does nothing
    return {
      start: () => console.warn('Speech recognition not supported'),
      stop: () => {},
      isListening: false
    };
  }
  
  // Create recognition instance
  const recognition = new SpeechRecognition();
  
  // Configure the recognition
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";
  
  // Set up the event handlers
  recognition.onresult = (event) => {
    if (event.results.length > 0) {
      const transcript = event.results[0][0].transcript.toUpperCase();
      callback(transcript);
    }
  };
  
  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
  };
  
  recognition.onend = () => {
    console.log('Speech recognition ended');
  };
  
  // Return the recognition object
  return recognition;
}