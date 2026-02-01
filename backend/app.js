import express from 'express';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello, World!');
});
export default app;