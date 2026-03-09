import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();  // load .env
connectDB();      // connect MongoDB

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://dveconect-gv4m.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Map of userId to socketId
const userSocketMap = new Map();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Store user socket mapping when they connect
  socket.on('register', (userId) => {
    userSocketMap.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);

    // Broadcast active users
    io.emit('onlineUsers', Array.from(userSocketMap.keys()));
  });

  socket.on('sendMessage', (messageData) => {
    const { receiverId } = messageData;
    const receiverSocketId = userSocketMap.get(receiverId);

    // If receiver is online, emit the event to them
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', messageData);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove user from map
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        io.emit('onlineUsers', Array.from(userSocketMap.keys()));
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
