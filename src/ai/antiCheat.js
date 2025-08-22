// src/ai/antiCheat.js
const { t } = require("../i18n");

async function aiReportFeature(bot, chatId, lang="en") {
  const txt = t(lang, "ai_report_intro") || "🛡️ Send details of suspicious behavior. Our AI will analyze it.";
  await bot.sendMessage(chatId, txt);
}

module.exports = { aiReportFeature };
