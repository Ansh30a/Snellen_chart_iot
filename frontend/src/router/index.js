// frontend/src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import SnellenChart from "../components/SnellenChart.vue";
import Results from "../views/Results.vue";

const routes = [
  { 
    path: "/", 
    name: "home",
    component: Home 
  },
  { 
    path: "/test", 
    name: "test",
    component: SnellenChart 
  },
  { 
    path: "/results", 
    name: "results",
    component: Results 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;