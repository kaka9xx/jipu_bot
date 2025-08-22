const userRepo = require('../services/userRepo');

module.exports = async function deleteUserFeature(bot, chatId, userId) {
  await userRepo.remove(userId);
  await bot.sendMessage(chatId, "🗑️ Tài khoản đã được xoá.");
};
