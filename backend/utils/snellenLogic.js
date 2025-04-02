// backend/utils/snellenLogic.js
import { SNELLEN_CHART_ROWS, SNELLEN_SCORES } from '../config/index.js';

// Calculate vision score based on transcription accuracy
export function calculateScore(transcription) {
  if (!transcription || transcription.trim() === '') {
    console.warn("Empty transcription received, returning default score");
    return SNELLEN_SCORES[0]; // Return the lowest score
  }
  
  // Normalize transcription - uppercase and split by spaces
  const words = transcription.trim().toUpperCase().split(/\s+/);
  let lastCorrectRow = -1;
  
  console.log("Processing transcription words:", words);
  
  // Check each row of the Snellen chart
  for (let index = 0; index < SNELLEN_CHART_ROWS.length; index++) {
    const row = SNELLEN_CHART_ROWS[index];
    const rowLetters = row.split(/\s+/);
    let rowMistakes = 0;
    
    console.log(`Checking row ${index}: "${row}" against words:`, words);
    
    // Count mistakes in this row
    rowLetters.forEach((letter, letterIndex) => {
      // Avoid index out of bounds
      if (letterIndex < words.length) {
        if (words[letterIndex] !== letter) {
          rowMistakes++;
          console.log(`Mistake at position ${letterIndex}: expected "${letter}", got "${words[letterIndex]}"`);
        }
      } else {
        rowMistakes++;
        console.log(`Missing word at position ${letterIndex}`);
      }
    });
    
    // Calculate accuracy percentage for this row
    const accuracy = 1 - (rowMistakes / rowLetters.length);
    console.log(`Row ${index} accuracy: ${accuracy * 100}%`);
    
    // Consider row correct if accuracy is at least 60%
    if (accuracy >= 0.6) {
      lastCorrectRow = index;
      console.log(`Row ${index} passed with accuracy ${accuracy * 100}%`);
    } else {
      console.log(`Row ${index} failed with accuracy ${accuracy * 100}%`);
      // Stop processing once a row fails
      break;
    }
  }
  
  // Get score based on the last correctly read row
  const scoreIndex = Math.max(0, lastCorrectRow);
  console.log(`Final score index: ${scoreIndex}, Score: ${SNELLEN_SCORES[scoreIndex]}`);
  return SNELLEN_SCORES[scoreIndex];
}