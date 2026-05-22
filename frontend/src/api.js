import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Проверка здоровья сервера
export const checkHealth = () => api.get('/health');

// Auth endpoints (будут добавлены позже)
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Tasks endpoints (будут добавлены позже)
export const getTasks = () => api.get('/tasks');
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

export default api;
