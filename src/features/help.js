// src/features/help.js
const { getUserById } = require("../core/user");
const { t } = require("../i18n");

/**
 * Xử lý lệnh /help
 * @param {TelegramBot} bot - instance của bot
 * @param {Object} msg - message Telegram gửi đến
 * @param {number} chatId - ID của user/chat
 */
async function helpFeature(bot, msg, chatId) {
  // ✅ lấy user từ DB (async)
  const user = await getUserById(chatId);
  const lang = user?.lang || "en";

  // ✅ nội dung help lấy từ i18n
  const helpText = [
    "ℹ️ " + t(lang, "help_title"),     // Ví dụ: "Help / Trợ giúp"
    t(lang, "help_usage"),            // "Bạn có thể dùng các lệnh sau:"
    "/start - " + t(lang, "help_start"),
    "/menu - " + t(lang, "help_menu"),
    "/farm - " + t(lang, "help_farm"),
    "/claim - " + t(lang, "help_claim"),
    "/shop - " + t(lang, "help_shop"),
    "/settings - " + t(lang, "help_settings"),
  ].join("\n");

  try {
    await bot.sendMessage(chatId, helpText, { parse_mode: "Markdown" });
  } catch (err) {
    console.error("❌ Failed to send help:", err.message);
  }
}

module.exports = { helpFeature };
