// src/services/userService.js
const userRepo = require('./userRepo');

async function getUserById(id) {
  return await userRepo.getById(id);
}

async function createOrUpdateUser(user) {
  return await userRepo.upsert(user);
}

async function getAllUsers() {
  return await userRepo.getAll();
}

module.exports = { getUserById, createOrUpdateUser, getAllUsers };