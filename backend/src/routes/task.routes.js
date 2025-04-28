import express from 'express';
const router = express.Router();


import { importTasks, getAllTasks, createTask, updateTask, deleteTask } from '../controllers/Task.controller.js';


router.post('/import', importTasks);
router.get('/tasks', getAllTasks);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);





export default router;
