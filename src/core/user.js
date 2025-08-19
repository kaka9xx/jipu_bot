// src/core/user.js
const users = new Map();

function getUserById(chatId) {
  return users.get(String(chatId)) || null;
}

function addOrUpdateUser(user) {
  if (!user || user.id == null) return null;
  users.set(String(user.id), user);
  return user;
}

function removeUser(chatId) {
  return users.delete(String(chatId));
}

module.exports = { getUserById, addOrUpdateUser, removeUser };
