module.exports = async function startFeature(bot, chatId) {
  await bot.sendMessage(chatId, "👋 Chào mừng bạn đến với Jipu Farm!", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🌾 Farm", callback_data: "farm" }],
        [{ text: "🧑 Hồ sơ", callback_data: "profile" }],
        [{ text: "🛒 Shop", callback_data: "shop" }],
        [{ text: "⚙️ Cài đặt", callback_data: "settings" }],
        [{ text: "ℹ️ Trợ giúp", callback_data: "help" }]
      ]
    }
  });
};
