// frontend/src/store/index.js
import { defineStore } from "pinia";
import axios from "axios";

// API Base URL from environment variable or default
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050/api";

export const useSnellenStore = defineStore("snellen", {
  state: () => ({
    results: [],
    latestResult: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchResults() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${apiBaseUrl}/tests/results`);
        this.results = response.data;
      } catch (error) {
        console.error("Error fetching results:", error);
        this.error = "Failed to load results";
      } finally {
        this.loading = false;
      }
    },
    
    setLatestResult(result) {
      this.latestResult = result;
    },
    
    clearLatestResult() {
      this.latestResult = null;
    }
  },
});