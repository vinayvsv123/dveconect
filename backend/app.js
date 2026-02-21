import express from 'express';
import cors from 'cors';
import userRoutes from './src/routes/userRoutes.js';
import projectRoutes from './src/routes/projectRoutes.js';

const app = express();

// 1. Apply CORS before all routes
app.use(cors({
  origin: 'http://localhost:5173', // your frontend
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'], // include Authorization
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

//  2. Routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

app.get('/', (req,res) => res.send('Hello World'));

export default app;