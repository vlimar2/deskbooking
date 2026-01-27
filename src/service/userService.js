const { users } = require('../model/db');
const User = require('../model/user');

function register(username, password) {
  if (users.find(u => u.username === username)) return null;
  const user = new User(users.length + 1, username, password);
  users.push(user);
  return user;
}

function findByUsername(username) {
  return users.find(u => u.username === username);
}

module.exports = { register, findByUsername };
