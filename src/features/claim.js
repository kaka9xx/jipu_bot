const userRepo = require('../services/userRepo');

module.exports = async function claimFeature(bot, chatId, userId) {
  const now = Date.now();
  const user = await userRepo.findOrCreate(userId);

  if (user.lastClaim && now - user.lastClaim < 30000) {
    const wait = Math.ceil((30000 - (now - user.lastClaim)) / 1000);
    return bot.sendMessage(chatId, `⚠️ Bạn click quá nhanh, thử lại sau ${wait}s`);
  }

  const reward = 5;
  user.tokens = (user.tokens || 0) + reward;
  user.lastClaim = now;
  await userRepo.save(user);

  await bot.sendMessage(chatId, `🎉 Claim thành công +${reward} $JIP!\nTổng số dư: ${user.tokens}`);
};
