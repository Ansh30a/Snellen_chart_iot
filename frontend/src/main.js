// frontend/src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

import "./assets/main.css"; // Optional styling

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia); // Use Pinia for state management

app.mount("#app");