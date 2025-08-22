//src/core/commandHandler.js
const { t } = require("../i18n");
const { showMainMenu } = require("../utils/menu");
const { farmLogic } = require("../features/farm");
const { claimLogic } = require("../features/claim");
const { shopLogic } = require("../features/shop");
const { settingsLogic } = require("../features/settings");
const { helpFeature } = require("../features/help");
const { startFeature } = require("../features/start");
const { profileFeature } = require("../features/profile");
const { updateUserFromMsg } = require("./user");

const { listUsersFeature } = require("../features/listUsers");
const {
  deleteUserFeature,
  whoAmIFeature,
  deleteUserCsvFeature,
  exportUsersFeature
} = require("../features/deleteUser");

async function handleCommand(bot, msg, lang) {
  const chatId = msg.chat.id;
   // ✅ Update info user mới nhất
  await updateUserFromMsg(msg);
  const text = (msg.text || "").trim();

  // /start
  if (text.startsWith("/start")) {
    await startFeature(bot, msg, chatId, lang);
    return;
  }

  // /help
  if (text.startsWith("/help") || text === t(lang, "btn_help")) {
    await helpFeature(bot, msg, chatId);
    return;
  }

  // /whoami
  if (text.startsWith("/whoami")) {
    whoAmIFeature(bot, msg, chatId);
    return;
  }

  // /listusers
  if (text.startsWith("/listusers")) {
    listUsersFeature(bot, msg, chatId);
    return;
  }

  // /deleteuser
  if (text.startsWith("/deleteuser")) {
    deleteUserFeature(bot, msg, chatId);
    return;
  }

  // /deleteusercsv
  if (text.startsWith("/deleteusercsv")) {
    deleteUserCsvFeature(bot, msg, chatId);
    return;
  }

  // /exportusers
  if (text.startsWith("/exportusers")) {
    exportUsersFeature(bot, msg, chatId);
    return;
  }

  // Các command khác
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

  if (text.startsWith("/profile")) {
    await profileFeature(bot, msg, chatId);
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
