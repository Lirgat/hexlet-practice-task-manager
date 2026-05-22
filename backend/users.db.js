// In-memory база данных
const users = [];
const tasks = [];
let nextUserId = 1;
let nextTaskId = 1;

module.exports = {
  // Users
  users,
  getNextUserId: () => nextUserId++,
  getNextTaskId: () => nextTaskId++,
  
  findUserByEmail: (email) => users.find(u => u.email === email),
  findUserById: (id) => users.find(u => u.id === id),
  
  createUser: (user) => {
    users.push(user);
    return user;
  },
  
  // Tasks
  tasks,
  createTask: (task) => {
    tasks.push(task);
    return task;
  },
  
  findTaskById: (id) => tasks.find(t => t.id === id),
  findTasksByUser: (userId) => tasks.filter(t => t.userId === userId),
  
  updateTask: (id, data) => {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...data };
      return tasks[index];
    }
    return null;
  },
  
  deleteTask: (id) => {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks.splice(index, 1);
      return true;
    }
    return false;
  }
};
