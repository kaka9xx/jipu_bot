//src/core/user.js
const userService = require('../services/userService');

/**
 * Lấy user theo ID
 */
async function getUserById(id) {
  return await userService.getUserById(id);
}

/**
 * Thêm hoặc cập nhật user
 */
async function addOrUpdateUser(user) {
  return await userService.createOrUpdateUser(user);
}

/**
 * Cập nhật thông tin user từ Telegram message
 */
async function updateUserFromMsg(msg) {
  if (!msg || !msg.chat) return;
  const chatId = msg.chat.id;
  const userData = {
    id: chatId,
    first_name: msg.chat.first_name,
    username: msg.chat.username,
  };
  await addOrUpdateUser(userData);
}

/**
 * Lấy user và tự động cập nhật thông tin mới từ Telegram message nếu có
 * Nếu không có msg, chỉ lấy user từ DB
 */
async function getUserByIdAndUpdate(id, msg = null) {
  if (msg) {
    await updateUserFromMsg(msg);
  }
  return await getUserById(id);
}

/**
 * Lấy tất cả user
 */
async function getAllUsers() {
  return await userService.getAllUsers();
}

module.exports = {
  getUserById,
  addOrUpdateUser,
  getAllUsers,
  updateUserFromMsg,
  getUserByIdAndUpdate,
};
