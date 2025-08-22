// src/core/commandHandler.js
const { t } = require("../i18n");
const { showMainMenu } = require("../utils/menu");
const { farmLogic } = require("../features/farm");
const { claimLogic } = require("../features/claim");
const { shopLogic } = require("../features/shop");
const { settingsLogic } = require("../features/settings");
const { helpFeature } = require("../features/help");
const{startFeature} = require("../features/start");
const { profileFeature } = require("../features/profile");

async function handleCommand(bot, msg, lang) {
  const chatId = msg.chat.id;
  const text = (msg.text || "").trim();

  // Các command chính
     if (text.startsWith("/start")) {
    startFeature(bot, chatId, lang);
    return;
  }

  if (text.startsWith("/help") || text === t(lang, "btn_help")) {
    await helpFeature(bot, msg, chatId);
    return;
  }

  if (text.startsWith("/echo")) {
    const rest = text.replace("/echo", "").trim();
    bot.sendMessage(chatId, rest || t(lang, "echo_empty"));
    return;
  }

  if (text.startsWith("/menu")) {
    showMainMenu(bot, chatId, lang);
    return;
  }

  if (text.startsWith("/farm") || text === t(lang, "btn_farm")) {
    farmLogic(bot, chatId, lang);
    return;
  }

  if (text.startsWith("/claim") || text === t(lang, "btn_claim")) {
    claimLogic(bot, chatId, lang);
    return;
  }

  if (text.startsWith("/shop") || text === t(lang, "btn_shop")) {
    shopLogic(bot, chatId, lang);
    return;
  }

  if (text.startsWith("/language")) {
    const { settingsShowLanguage } = require("../features/settings");
    settingsShowLanguage(bot, chatId, lang);
    return;
  }

  if (text.startsWith("/settings") || text === t(lang, "btn_settings")) {
    settingsLogic(bot, chatId, lang);
    return;
  }

  // Nếu không khớp lệnh nào
  bot.sendMessage(chatId, t(lang, "unknown_command"));
}

module.exports = { handleCommand };
