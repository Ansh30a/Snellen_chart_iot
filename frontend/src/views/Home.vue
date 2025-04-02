<!-- frontend/src/views/Home.vue -->
<template>
  <div class="home-container">
    <div class="hero">
      <h1>Digital Snellen Chart Vision Test</h1>
      <p class="subtitle">Test your vision using IoT and AI speech recognition technology</p>
      
      <div class="actions">
        <router-link to="/test" class="btn-primary">Start Vision Test</router-link>
        <router-link to="/results" class="btn-secondary">View Test History</router-link>
      </div>
    </div>
    
    <div class="info-cards">
      <div class="card">
        <div class="card-icon">👁️</div>
        <h3>Standard Eye Test</h3>
        <p>Our digital Snellen chart follows the same standardized testing procedures used by optometrists.</p>
      </div>
      
      <div class="card">
        <div class="card-icon">🎤</div>
        <h3>Voice Recognition</h3>
        <p>Simply read the letters aloud and our system will automatically process your responses.</p>
      </div>
      
      <div class="card">
        <div class="card-icon">📊</div>
        <h3>Instant Results</h3>
        <p>Get your vision score immediately after completing the test, with detailed explanations.</p>
      </div>
    </div>
    
    <div class="how-it-works">
      <h2>How It Works</h2>
      <ol>
        <li>Position yourself approximately 20 feet (6 meters) from your screen</li>
        <li>Start the test and follow the on-screen instructions</li>
        <li>Read the letters displayed on the screen aloud</li>
        <li>Our system captures your voice and analyzes your responses</li>
        <li>Receive your vision score at the end of the test</li>
      </ol>
    </div>
    
    <div class="disclaimer">
      <h3>Disclaimer</h3>
      <p>This digital vision test is for informational purposes only and should not replace professional medical advice. 
        If you experience vision problems, please consult with an ophthalmologist or optometrist.</p>
    </div>
  </div>
</template>

<script setup>
// No setup needed for the home page
</script>

<style scoped>
.home-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.hero {
  text-align: center;
  padding: 40px 20px;
  margin-bottom: 40px;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #2c3e50;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.btn-primary, .btn-secondary {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-secondary {
  background-color: #eaeaea;
  color: #2c3e50;
}

.btn-primary:hover, .btn-secondary:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.info-cards {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 40px;
}

.card {
  flex: 1;
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.card:hover {
  transform: translateY(-5px);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.card h3 {
  margin-bottom: 10px;
  color: #2c3e50;
}

.how-it-works {
  background-color: #f0f8ff;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 40px;
}

.how-it-works h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.how-it-works ol {
  padding-left: 30px;
}

.how-it-works li {
  margin-bottom: 15px;
  line-height: 1.5;
}

.disclaimer {
  background-color: #fff8e1;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #ffc107;
}

.disclaimer h3 {
  color: #b28704;
  margin-top: 0;
  margin-bottom: 10px;
}

.disclaimer p {
  color: #333;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .info-cards {
    flex-direction: column;
  }
  
  .actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
    text-align: center;
  }
}
</style>