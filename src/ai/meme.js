// src/ai/meme.js
const { t } = require("../i18n");

async function aiMemeFeature(bot, chatId, lang="en") {
  const caption = t(lang, "ai_meme_caption") || "😂 Here's a fun Jipu meme!";
  await bot.sendMessage(chatId, caption);
}

module.exports = { aiMemeFeature };
