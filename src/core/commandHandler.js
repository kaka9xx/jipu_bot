// src/core/commandHandler.js
const startFeature = require("../features/start");
const helpFeature = require("../features/help");
const profileFeature = require("../features/profile");
const farmFeature = require("../features/farm");
const shopFeature = require("../features/shop");
const settingsFeature = require("../features/settings");

// AI & NPC
const askAI = require("../ai/ask");
const npcChat = require("../ai/npc");

module.exports = function commandHandler(bot) {
bot.onText(/\/start/, (msg) => {
startFeature(bot, msg.chat.id, msg.from.id);
});

bot.onText(/\/help/, (msg) => {
helpFeature(bot, msg.chat.id);
});

bot.onText(/\/profile/, (msg) => {
profileFeature(bot, msg.chat.id, msg.from.id);
});

bot.onText(/\/farm/, (msg) => {
farmFeature(bot, msg.chat.id, msg.from.id);
});

bot.onText(/\/shop/, (msg) => {
shopFeature(bot, msg.chat.id);
});

bot.onText(/\/settings/, (msg) => {
settingsFeature(bot, msg.chat.id);
});

// 🚀 New AI command
bot.onText(/\/ai (.+)/, async (msg, match) => {
const question = match[1];
const reply = await askAI(question);
bot.sendMessage(msg.chat.id, "🤖 " + reply);
});

// 🚀 New NPC command
bot.onText(/\/npc (.+)/, async (msg, match) => {
const message = match[1];
const reply = await npcChat(msg.from.id, message);
bot.sendMessage(msg.chat.id, "🧑‍🌾 NPC Jipu: " + reply);
});
};
