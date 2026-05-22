const express = require('express');
const authMiddleware = require('../middleware/auth');
const { tasks, getNextTaskId, createTask, updateTask, deleteTask, findTasksByUser } = require('../users.db');

const router = express.Router();
router.use(authMiddleware);

// Получить все задачи пользователя
router.get('/', (req, res) => {
  try {
    const userTasks = findTasksByUser(req.userId);
    res.json(userTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Создать задачу
router.post('/', (req, res) => {
  try {
    const { title, description, status = 'todo', priority = 'medium', dueDate = null } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const task = {
      id: getNextTaskId(),
      title,
      description: description || '',
      status,
      priority,
      dueDate,
      userId: req.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    createTask(task);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Обновить задачу
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;
    
    const task = findTasksByUser(req.userId).find(t => t.id === parseInt(id));
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const updatedTask = updateTask(parseInt(id), {
      title: title || task.title,
      description: description !== undefined ? description : task.description,
      status: status || task.status,
      priority: priority || task.priority,
      dueDate: dueDate !== undefined ? dueDate : task.dueDate,
      updatedAt: new Date().toISOString()
    });
    
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Удалить задачу
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const task = findTasksByUser(req.userId).find(t => t.id === parseInt(id));
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    deleteTask(parseInt(id));
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
