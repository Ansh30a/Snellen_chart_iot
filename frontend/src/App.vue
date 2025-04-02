<template>
  <div class="app-container">
    <header>
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/test">Start Test</router-link> |
        <router-link to="/results">Results</router-link>
      </nav>
    </header>
    
    <main>
      <router-view />
    </main>
    
    <footer>
      <p>Snellen Chart IoT Project</p>
    </footer>
  </div>
</template>

<script setup>
// No setup needed for this component
</script>

<style>
.app-container {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eaeaea;
}

nav {
  padding: 15px 0;
}

nav a {
  margin: 0 10px;
  color: #2c3e50;
  text-decoration: none;
}

nav a.router-link-active {
  color: #42b983;
  font-weight: bold;
}

footer {
  margin-top: 40px;
  padding-top: 10px;
  border-top: 1px solid #eaeaea;
  text-align: center;
  color: #666;
}
</style>