const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// In-memory хранилище задач
const tasks = [];
let nextTaskId = 1;

// Получить все задачи пользователя
router.get('/', (req, res) => {
  const userTasks = tasks.filter(t => t.userId === req.userId);
  res.json(userTasks);
});

// Создать задачу
router.post('/', (req, res) => {
  const { title, description, status = 'todo' } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const task = {
    id: nextTaskId++,
    title,
    description: description || '',
    status,
    userId: req.userId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  tasks.push(task);
  res.status(201).json(task);
});

// Обновить задачу
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  
  const taskIndex = tasks.findIndex(t => t.id === parseInt(id) && t.userId === req.userId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: title || tasks[taskIndex].title,
    description: description !== undefined ? description : tasks[taskIndex].description,
    status: status || tasks[taskIndex].status,
    updatedAt: new Date()
  };
  
  res.json(tasks[taskIndex]);
});

// Удалить задачу
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  const taskIndex = tasks.findIndex(t => t.id === parseInt(id) && t.userId === req.userId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks.splice(taskIndex, 1);
  res.json({ message: 'Task deleted successfully' });
});

module.exports = router;
