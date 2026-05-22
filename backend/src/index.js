const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Простой обработчик для корневого маршрута, чтобы не было "Cannot GET /"
app.get('/', (req, res) => {
  res.send('Task Manager API is running. Use /api/health to check status.');
});

// Эндпоинт для проверки здоровья
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});