// src/core/commandHandler.js
const { t } = require("../i18n");
const { getLang } = require("./lang");
const { showMainMenu } = require("../utils/menu");
const { startFeature } = require("../features/start");
const { helpFeature } = require("../features/help");
const { farmLogic } = require("../features/farm");
const { claimLogic } = require("../features/claim");
const { shopLogic } = require("../features/shop");
const { settingsLogic, settingsShowLanguage } = require("../features/settings");

/**
 * Xử lý tất cả command từ user
 */
async function handleCommand(bot, msg) {
  const chatId = msg.chat.id;
  const text = (msg.text || "").trim();
  const lang = await getLang(chatId, msg);

  if (text.startsWith("/start")) {
    return startFeature(bot, msg, chatId);
  }

  if (text.startsWith("/help")) {
    return helpFeature(bot, msg, chatId, lang);
  }

  if (text.startsWith("/echo")) {
    const rest = text.replace("/echo", "").trim();
    return bot.sendMessage(chatId, rest || t(lang, "echo_empty"));
  }

  if (text.startsWith("/menu")) {
    return showMainMenu(bot, chatId, lang);
  }

  if (text.startsWith("/farm")) {
    return farmLogic(bot, chatId, lang);
  }

  if (text.startsWith("/claim")) {
    return claimLogic(bot, chatId, lang);
  }

  if (text.startsWith("/shop")) {
    return shopLogic(bot, chatId, lang);
  }

  if (text.startsWith("/language")) {
    return settingsShowLanguage(bot, chatId, lang);
  }

  if (text.startsWith("/settings")) {
    return settingsLogic(bot, chatId, lang);
  }

  // ❓ Nếu không khớp lệnh nào
  return bot.sendMessage(chatId, t(lang, "unknown_command"));
}

module.exports = { handleCommand };
