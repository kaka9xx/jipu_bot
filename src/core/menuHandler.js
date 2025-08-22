// src/core/menuHandler.js
const farmFeature = require("../features/farm");
const profileFeature = require("../features/profile");
const shopFeature = require("../features/shop");
const settingsFeature = require("../features/settings");
const helpFeature = require("../features/help");

// AI & NPC
const askAI = require("../ai/ask");
const npcChat = require("../ai/npc");

module.exports = async function menuHandler(bot, query) {
const chatId = query.message.chat.id;
const userId = query.from.id;
const action = query.data;

switch (action) {
case "farm":
await farmFeature(bot, chatId, userId);
break;

case "profile":
await profileFeature(bot, chatId, userId);
break;

case "shop":
await shopFeature(bot, chatId);
break;

case "settings":
await settingsFeature(bot, chatId);
break;

case "help":
await helpFeature(bot, chatId);
break;

// 🚀 Menu AI
case "ai":
await bot.sendMessage(chatId, "💡 Hãy dùng lệnh /ai <câu hỏi> để trò chuyện với AI.");
break;

// 🚀 Menu NPC
case "npc":
const npcAnswer = await npcChat(userId, "Xin chào NPC!");
await bot.sendMessage(chatId, "🧑‍🌾 NPC Jipu: " + npcAnswer);
break;

default:
await bot.sendMessage(chatId, "❓ Không rõ lựa chọn.");
}
};
