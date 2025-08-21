// src/features/help.js
const { getUserById } = require("../core/user");
const { t } = require("../i18n");

/**
 * Xử lý lệnh /help
 * @param {TelegramBot} bot - instance bot
 * @param {Object} msg - message từ Telegram
 * @param {number} chatId - ID chat
 */
async function helpFeature(bot, msg, chatId) {
  // Lấy user từ DB
  const user = await getUserById(chatId);
  const lang = user?.lang || "en";

  // Soạn nội dung help từ i18n
  const helpLines = [
    "ℹ️ " + t(lang, "help.title"),
    t(lang, "help.usage"),
    "/start - " + t(lang, "help.start"),
    "/menu - " + t(lang, "help.menu"),
    "/farm - " + t(lang, "help.farm"),
    "/claim - " + t(lang, "help.claim"),
    "/shop - " + t(lang, "help.shop"),
    "/settings - " + t(lang, "help.settings"),
  ];

  const helpText = helpLines.join("\n");

  try {
    await bot.sendMessage(chatId, helpText, { parse_mode: "Markdown" });
  } catch (err) {
    console.error("❌ Failed to send help:", err.message);
  }
}

module.exports = { helpFeature };
