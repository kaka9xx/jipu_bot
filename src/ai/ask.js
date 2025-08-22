// src/ai/ask.js
const { t } = require("../i18n");

async function aiAskFeature(bot, chatId, lang="en") {
  await bot.sendMessage(chatId, "💬 " + (t(lang, "ai_ask_intro") || "What would you like to ask Jipu AI?"));
}

module.exports = { aiAskFeature };
