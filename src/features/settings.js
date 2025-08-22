module.exports = async function settingsFeature(bot, chatId) {
  await bot.sendMessage(chatId, "⚙️ Menu cài đặt:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🌐 Đổi ngôn ngữ", callback_data: "settings_lang" }],
        [{ text: "🗑️ Xoá tài khoản", callback_data: "settings_delete" }],
        [{ text: "⬅️ Quay lại", callback_data: "start" }]
      ]
    }
  });
};
