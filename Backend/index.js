const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      allowedHeaders: ['my-custom-header'],
      credentials: true
    }
  });
const PORT = 8000;
const newsController = require('./src/controler/news');
const router = require('./src/routes');
require('./src/db/connection');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Socket.IO controller
newsController.initialize(io);

// Routes
router(app);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle client disconnection
//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
