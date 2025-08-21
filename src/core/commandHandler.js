// src/core/commandHandler.js
const { t } = require("../i18n");
const { showMainMenu } = require("../utils/menu");
const { farmLogic } = require("../features/farm");
const { claimLogic } = require("../features/claim");
const { shopLogic } = require("../features/shop");
const { settingsLogic, settingsShowLanguage } = require("../features/settings");
const { helpFeature } = require("../features/help");

/**
 * Xử lý các lệnh người dùng gõ trực tiếp (/help, /farm, /shop, ...)
 * @param {TelegramBot} bot - instance bot
 * @param {Object} msg - message từ Telegram
 * @param {string} lang - ngôn ngữ của user (ví dụ: 'en', 'vi')
 */
function handleCommand(bot, msg, lang) {
  const chatId = msg.chat.id;
  const text = (msg.text || "").trim();

  // 👉 Lệnh /help
  if (text.startsWith("/help")) {
    helpFeature(bot, msg, chatId, lang);
    return;
  }

  // 👉 Lệnh /echo <text>
  if (text.startsWith("/echo")) {
    const rest = text.replace("/echo", "").trim();
    bot.sendMessage(chatId, rest || t(lang, "echo_empty"));
    return;
  }

  // 👉 Lệnh /menu
  if (text.startsWith("/menu")) {
    showMainMenu(bot, chatId, lang);
    return;
  }

  // 👉 Lệnh /farm
  if (text.startsWith("/farm")) {
    farmLogic(bot, chatId, lang);
    return;
  }

  // 👉 Lệnh /claim
  if (text.startsWith("/claim")) {
    claimLogic(bot, chatId, lang);
    return;
  }

  // 👉 Lệnh /shop
  if (text.startsWith("/shop")) {
    shopLogic(bot, chatId, lang);
    return;
  }

  // 👉 Lệnh /language (hiện menu chọn ngôn ngữ)
  if (text.startsWith("/language")) {
    settingsShowLanguage(bot, chatId, lang);
    return;
  }

  // 👉 Lệnh /settings
  if (text.startsWith("/settings")) {
    settingsLogic(bot, chatId, lang);
    return;
  }

  // 👉 Nếu không khớp lệnh nào
  bot.sendMessage(chatId, t(lang, "unknown_command"));
}

module.exports = { handleCommand };
