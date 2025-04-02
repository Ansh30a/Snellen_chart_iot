<!-- frontend/src/components/ResultsDisplay.vue -->
<template>
  <div class="results-display">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading results...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="$emit('retry')" class="retry-btn">Retry</button>
    </div>
    
    <div v-else class="results-content">
      <!-- Latest result section -->
      <div v-if="latestResult" class="latest-result">
        <h2>Latest Test Result</h2>
        <div class="result-card highlight">
          <div class="score-badge">{{ latestResult.score }}</div>
          <div class="result-details">
            <p class="result-text"><strong>Test Reading:</strong> "{{ latestResult.text }}"</p>
            <p class="result-time"><strong>Date:</strong> {{ formatDate(latestResult.timestamp) }}</p>
          </div>
        </div>
      </div>
      
      <!-- Historical results section -->
      <div class="historical-results">
        <h2>Test History</h2>
        
        <div v-if="!results || results.length === 0" class="no-results">
          <p>No previous test results found.</p>
        </div>
        
        <div v-else class="results-list">
          <div v-for="(result, index) in results" :key="index" class="result-card">
            <div class="score-badge">{{ result.score }}</div>
            <div class="result-details">
              <p class="result-text"><strong>Test Reading:</strong> "{{ result.text }}"</p>
              <p class="result-time"><strong>Date:</strong> {{ formatDate(result.timestamp) }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Vision score explanation -->
      <div class="score-explanation">
        <h3>Understanding Your Vision Score</h3>
        <p>The Snellen fraction (e.g., 20/20) indicates your visual acuity:</p>
        <ul>
          <li><strong>20/20:</strong> Normal vision</li>
          <li><strong>20/30 to 20/70:</strong> Mild to moderate visual impairment</li>
          <li><strong>20/100 or worse:</strong> Significant visual impairment</li>
        </ul>
        <p>These scores represent how clearly you can see at 20 feet compared to someone with normal vision.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  results: {
    type: Array,
    default: () => []
  },
  latestResult: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
});

defineEmits(['retry']);

// Format date for display
function formatDate(timestamp) {
  if (!timestamp) return 'Not available';
  
  const date = new Date(timestamp);
  return date.toLocaleString();
}
</script>

<style scoped>
.results-display {
  max-width: 800px;
  margin: 0 auto;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 30px;
  background-color: #fff3f3;
  border-radius: 12px;
  margin: 20px 0;
}

.retry-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 15px;
  font-size: 14px;
}

.results-content {
  padding: 10px;
}

.latest-result {
  margin-bottom: 40px;
}

h2 {
  font-size: 24px;
  margin-bottom: 15px;
  color: #2c3e50;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 10px;
}

.result-card {
  display: flex;
  background-color: #f8f9fa;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.result-card.highlight {
  border: 2px solid #42b983;
  background-color: #f0fbf5;
}

.score-badge {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2c3e50;
  color: white;
  font-size: 22px;
  font-weight: bold;
  padding: 20px;
  min-width: 120px;
}

.result-details {
  flex: 1;
  padding: 15px;
}

.result-text {
  margin: 5px 0;
  font-size: 16px;
}

.result-time {
  margin: 5px 0;
  color: #666;
  font-size: 14px;
}

.no-results {
  text-align: center;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 12px;
}

.score-explanation {
  margin-top: 40px;
  padding: 20px;
  background-color: #f0f8ff;
  border-radius: 10px;
  border-left: 4px solid #3498db;
}

.score-explanation h3 {
  margin-top: 0;
  color: #3498db;
}

.score-explanation ul {
  padding-left: 20px;
}

.score-explanation li {
  margin-bottom: 5px;
}
</style>