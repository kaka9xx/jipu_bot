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

// lấy ngôn ngữ user, fallback mặc định "en"
async function getUserLang(id) {
  const user = await userRepo.getById(id);
  return user?.lang || "en";
}

// cập nhật ngôn ngữ user
async function setUserLang(id, lang) {
  return await userRepo.upsert({ id, lang });
}

module.exports = { 
  getUserById, 
  createOrUpdateUser, 
  getAllUsers,
  getUserLang,
  setUserLang
};
