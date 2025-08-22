module.exports = async function helpFeature(bot, chatId) {
  await bot.sendMessage(chatId, "📖 Danh sách lệnh:\n/start - Bắt đầu\n/help - Trợ giúp\n/profile - Xem hồ sơ\n/settings - Cài đặt");
};
