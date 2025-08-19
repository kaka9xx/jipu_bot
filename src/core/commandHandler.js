// src/core/commandHandler.js
const { t } = require("../i18n");

function handleCommand(bot, msg, lang) {
  const chatId = msg.chat.id;
  const text = (msg.text || "").trim();

  if (text.startsWith("/start")) {
    bot.sendMessage(chatId, t(lang, "welcome_message"));
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

  bot.sendMessage(chatId, t(lang, "unknown_command"));
}

module.exports = { handleCommand };
