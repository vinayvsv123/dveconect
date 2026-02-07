import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import app from './app.js';
import userRoutes from './src/routes/userRoutes.js';
import projectRoutes from './src/routes/projectRoutes.js';

dotenv.config();  // load .env
connectDB();      // connect MongoDB

//user route
app.use('/api/users',userRoutes);
app.use('/api/projects',projectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Use user routes
//app.use('/api/users', userRoutes);
