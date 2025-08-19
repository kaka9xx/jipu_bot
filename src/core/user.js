// src/core/user.js
const path = require("path");
const { readJSON, writeJSON } = require("../utils/storage");

const USERS_FILE = path.join(__dirname, "../../data/users.json");

function getAllUsers() {
  return readJSON(USERS_FILE, []);
}

function getUserById(id) {
  const users = getAllUsers();
  return users.find(u => u.id === id);
}

function addOrUpdateUser(user) {
  const users = getAllUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx >= 0) users[idx] = { ...users[idx], ...user };
  else users.push(user);
  writeJSON(USERS_FILE, users);
  return user;
}

module.exports = { getAllUsers, getUserById, addOrUpdateUser };
