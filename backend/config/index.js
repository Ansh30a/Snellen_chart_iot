// backend/config/index.js
import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5050;
export const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/snellen_chart";
export const AUDIO_FILE_RAW = "audio_input.raw";
export const AUDIO_FILE_WAV = "audio_input.wav";

// Snellen Chart configuration
export const SNELLEN_CHART_ROWS = [
  "E", 
  "F P", 
  "T O Z", 
  "L P E D", 
  "P E C F D", 
  "E D F C Z P",
  "F E L O P Z D", 
  "D E F P O T E C"
];

// Corresponding vision scores for each row
export const SNELLEN_SCORES = [
  "20/200", 
  "20/100", 
  "20/70", 
  "20/50", 
  "20/40", 
  "20/30", 
  "20/25", 
  "20/20"
];

// Audio processing config
export const AUDIO_PROCESSING_THRESHOLD = 100000;