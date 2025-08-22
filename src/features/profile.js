const userRepo = require('../services/userRepo');

module.exports = async function profileFeature(bot, chatId, userId) {
  const user = await userRepo.findOrCreate(userId);
  await bot.sendMessage(chatId, `👤 Hồ sơ của bạn:\n- ID: ${user.id}\n- Token: ${user.tokens}`);
};
