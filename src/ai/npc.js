// src/ai/npc.js
const { t } = require("../i18n");

async function aiNpcFeature(bot, chatId, lang="en") {
  const msg = t(lang, "ai_npc_intro") || "👾 Jipu NPC: Today's quest — Tap 50 times to earn +10% bonus!";
  await bot.sendMessage(chatId, msg);
}

module.exports = { aiNpcFeature };
