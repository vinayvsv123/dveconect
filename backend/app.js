import express from 'express';
import cors from 'cors';
import userRoutes from './src/routes/userRoutes.js';
import projectRoutes from './src/routes/projectRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js';

const app = express();

// Allow both local dev and deployed frontend
const allowedOrigins = [
  'http://localhost:5173', 
  'https://dveconect-gv4m.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS not allowed for this origin'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/chats', chatRoutes);

app.get('/', (req, res) => res.send('Hello World'));

export default app;