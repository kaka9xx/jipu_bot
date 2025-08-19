// src/core/user.js
const users = new Map();

// Lấy user theo chatId
function getUserById(chatId) {
  return users.get(chatId) || null;
}

// Thêm/cập nhật user
function addUser(user) {
  users.set(user.id, user);
  return user;
}

// Xóa user
function removeUser(chatId) {
  return users.delete(chatId);
}

module.exports = {
  getUserById,
  addUser,
  removeUser
};
