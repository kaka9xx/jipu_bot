// src/core/commandHandler.js
const { t } = require("../i18n");
const { showMainMenu } = require("../utils/menu");
const { farmLogic } = require("../features/farm");
const { claimLogic } = require("../features/claim");
const { shopLogic } = require("../features/shop");
const { settingsLogic, settingsShowLanguage } = require("../features/settings");

/**
 * Xử lý command của user
 * @param {TelegramBot} bot
 * @param {object} msg
 * @param {string} lang - ngôn ngữ user
 */
function handleCommand(bot, msg, lang) {
  const chatId = msg.chat.id;
  const text = (msg.text || "").trim();

  switch (true) {
    case text.startsWith("/help"):
      bot.sendMessage(chatId, t(lang, "help_message"));
      break;

    case text.startsWith("/echo"):
      const rest = text.replace("/echo", "").trim();
      bot.sendMessage(chatId, rest || t(lang, "echo_empty"));
      break;

    case text.startsWith("/menu"):
      showMainMenu(bot, chatId, lang);
      break;

    case text.startsWith("/farm"):
      farmLogic(bot, chatId, lang);
      break;

    case text.startsWith("/claim"):
      claimLogic(bot, chatId, lang);
      break;

    case text.startsWith("/shop"):
      shopLogic(bot, chatId, lang);
      break;

    case text.startsWith("/language"):
      settingsShowLanguage(bot, chatId, lang);
      break;

    case text.startsWith("/settings"):
      settingsLogic(bot, chatId, lang);
      break;

    default:
      bot.sendMessage(chatId, t(lang, "unknown_command"));
  }
}

module.exports = { handleCommand };
