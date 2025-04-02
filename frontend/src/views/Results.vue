<template>
  <div class="results-container">
    <h1>📊 Vision Test Results</h1>

    <div v-if="snellenStore.latestResult" class="latest-result">
      <h2>Your Latest Test Result</h2>
      <div class="result-card highlight">
        <div class="score">{{ snellenStore.latestResult.score }}</div>
        <div class="details">
          <p><strong>Transcription:</strong> {{ snellenStore.latestResult.text }}</p>
          <p><strong>Date:</strong> {{ new Date().toLocaleString() }}</p>
        </div>
      </div>
    </div>

    <div class="history">
      <h2>Test History</h2>
      
      <div v-if="loading" class="loading">
        <p>Loading previous results...</p>
      </div>
      
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="fetchResults" class="btn-retry">Try Again</button>
      </div>
      
      <div v-else-if="results.length === 0" class="no-results">
        <p>No previous test results found.</p>
      </div>
      
      <div v-else class="results-list">
        <div v-for="(result, index) in results" :key="index" class="result-card">
          <div class="score">{{ result.score }}</div>
          <div class="details">
            <p><strong>Transcription:</strong> {{ result.text }}</p>
            <p><strong>Date:</strong> {{ new Date(result.timestamp).toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="actions">
      <router-link to="/test" class="btn-primary">Take New Test</router-link>
      <router-link to="/" class="btn-secondary">Back to Home</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useSnellenStore } from "../store";

const snellenStore = useSnellenStore();
const results = ref([]);
const loading = ref(true);
const error = ref(null);

// Fetch results from the store
async function fetchResults() {
  loading.value = true;
  error.value = null;
  
  try {
    await snellenStore.fetchResults();
    results.value = snellenStore.results;
  } catch (err) {
    error.value = "Failed to load results. Please try again.";
    console.error("Error loading results:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchResults();
});
</script>

<style scoped>
.results-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

h2 {
  margin-top: 30px;
  margin-bottom: 20px;
  color: #2c3e50;
}

.latest-result {
  margin-bottom: 40px;
}

.result-card {
  display: flex;
  background-color: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.result-card.highlight {
  border: 2px solid #42b983;
}

.score {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2c3e50;
  color: white;
  font-size: 24px;
  font-weight: bold;
  padding: 20px;
  min-width: 120px;
}

.details {
  flex: 1;
  padding: 20px;
}

.details p {
  margin: 10px 0;
}

.loading, .error, .no-results {
  text-align: center;
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 20px;
}

.btn-retry {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.btn-primary, .btn-secondary {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.2s;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-secondary {
  background-color: #eaeaea;
  color: #2c3e50;
}

.btn-primary:hover, .btn-secondary:hover, .btn-retry:hover {
  transform: translateY(-2px);
}
</style>