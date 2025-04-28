import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/task.routes.js';
import { connectDB } from './config/dbConnect.js';

dotenv.config({
    path: './env'
});


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



// Routes
app.use('/api/v1', taskRoutes);




connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
  });
