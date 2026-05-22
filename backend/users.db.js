// Простая in-memory база данных (для разработки)
const users = [];
let nextId = 1;

module.exports = {
  users,
  getNextId: () => nextId++,
  findUserByEmail: (email) => users.find(u => u.email === email),
  findUserById: (id) => users.find(u => u.id === id),
  createUser: (user) => {
    users.push(user);
    return user;
  }
};
