import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Автоматически добавляем токен в заголовки, если он есть
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Регистрация
export const register = (userData) => API.post('/auth/register', userData);
// Вход
export const login = (userData) => API.post('/auth/login', userData);

// Получить все задачи
export const getTasks = () => API.get('/tasks');
// Создать задачу
export const createTask = (taskData) => API.post('/tasks', taskData);
// Обновить задачу
export const updateTask = (id, taskData) => API.put(`/tasks/${id}`, taskData);
// Удалить задачу
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

export default API;
