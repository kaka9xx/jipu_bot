// src/features/help.js
// 👉 Tách riêng logic xử lý /help để có thể tái sử dụng cho cả lệnh và menu

const { t } = require("../i18n");

/**
 * Hiển thị nội dung trợ giúp cho người dùng
 * @param {TelegramBot} bot - instance bot
 * @param {Object} msg - object message từ Telegram
 * @param {Number} chatId - id của cuộc trò chuyện
 * @param {String} lang - ngôn ngữ của user
 */
async function helpFeature(bot, msg, chatId, lang = "en") {
  await bot.sendMessage(chatId, t(lang, "help_message"));
}

module.exports = { helpFeature };
