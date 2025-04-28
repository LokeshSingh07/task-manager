import {Task} from '../models/Task.models.js';
import { importTasksFromUrl } from '../utils/taskUtils.js';




export const importTasks = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: 'Google Sheets URL is required' });
    }

    const tasks = await importTasksFromUrl(url);

    // Save imported tasks to DB
    const data =  await Task.insertMany(tasks);

    return res.status(200).json({ message: 'Tasks imported successfully', data });
  }
  catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    return res.status(200).json(tasks);
  }
  catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;
    const newTask = new Task({ title, description, dueDate, priority, status, isCompleted: false});
    await newTask.save();
    return res.status(201).json(newTask);
  }
  catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json(updatedTask);
  }
  catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json({ message: 'Task deleted successfully' });
  }
  catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
