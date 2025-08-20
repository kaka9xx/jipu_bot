// src/core/user.js
// Adapter used by rest of app: wrap service functions and keep synchronous-friendly API
const userService = require('../services/userService');

async function getUserById(id) {
  return await userService.getUserById(id);
}

async function addOrUpdateUser(user) {
  return await userService.createOrUpdateUser(user);
}

async function getAllUsers() {
  return await userService.getAllUsers();
}

module.exports = { getUserById, addOrUpdateUser, getAllUsers };
