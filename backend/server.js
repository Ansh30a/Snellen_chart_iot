// backend/server.js
import express from 'express';
import cors from 'cors';
import http from 'http';
import { setupWebSocket } from './services/websocketService.js';
import testRoutes from './routes/testRoutes.js';
import { connectDB } from './models/transcriptionModel.js';
import { PORT } from './config/index.js';

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/tests', testRoutes);

// Create HTTP server
const server = http.createServer(app);

// Connect to MongoDB
await connectDB();

// Setup WebSocket server
setupWebSocket(server);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});