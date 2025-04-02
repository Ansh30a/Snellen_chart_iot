<template>
  <div class="container">
    <h1>Welcome to the Snellen Chart Test</h1>
    <button @click="fetchTranscriptions">Fetch Transcriptions</button>
    <ul v-if="transcriptions.length > 0">
      <li v-for="(transcription, index) in transcriptions" :key="index">
        {{ transcription.text }} - Score: {{ transcription.score }}
      </li>
    </ul>
    <p v-else>No transcriptions yet.</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const transcriptions = ref([]);

async function fetchTranscriptions() {
  try {
    const response = await axios.get("http://localhost:5050/api/transcriptions");
    transcriptions.value = response.data;
  } catch (error) {
    console.error("Error fetching transcriptions:", error);
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
