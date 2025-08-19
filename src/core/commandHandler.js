// src/core/commandHandler.js
const { t } = require("../i18n");
const { showMainMenu } = require("../utils/menu");
const { farmLogic } = require("../features/farm");
const { claimLogic } = require("../features/claim");
const { shopLogic } = require("../features/shop");
const { settingsLogic } = require("../features/settings");

function handleCommand(bot, msg, lang) {
  const chatId = msg.chat.id;
  const text = (msg.text || "").trim();

  if (text.startsWith("/start")) {
    bot.sendMessage(chatId, t(lang, "welcome_message"));
    showMainMenu(bot, chatId, lang);
    return;
  }

  if (text.startsWith("/help")) {
    bot.sendMessage(chatId, t(lang, "help_message"));
    return;
  }

  if (text.startsWith("/echo")) {
    const rest = text.replace("/echo", "").trim();
    bot.sendMessage(chatId, rest || t(lang, "echo_empty"));
    return;
  }

  // New: menu & features commands
  if (text.startsWith("/menu")) {
    showMainMenu(bot, chatId, lang);
    return;
  }

  if (text.startsWith("/farm")) {
    farmLogic(bot, chatId, lang);
    return;
  }

  if (text.startsWith("/claim")) {
    claimLogic(bot, chatId, lang);
    return;
  }

  if (text.startsWith("/shop")) {
    shopLogic(bot, chatId, lang);
    return;
  }

  if (text.startsWith("/language")) {
    // open language picker
    const chatId = msg.chat.id;
    const lang = lang || "en";
    const { settingsShowLanguage } = require("../features/settings");
    settingsShowLanguage(bot, chatId, lang);
    return;
  }

  if (text.startsWith("/settings")) {
    settingsLogic(bot, chatId, lang);
    return;
  }

  bot.sendMessage(chatId, t(lang, "unknown_command"));
}

module.exports = { handleCommand };
