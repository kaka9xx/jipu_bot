const { askAI } = require("../ai/ask");
const { npcQuest } = require("../ai/npc");
const { checkAntiCheat } = require("../ai/antiCheat");

module.exports = function setupMenuHandler(bot, i18n) {
bot.on("callback_query", async (callbackQuery) => {
const chatId = callbackQuery.message.chat.id;
const userId = callbackQuery.from.id;
const action = callbackQuery.data;

try {
// 🛡️ Anti-cheat check
const warning = checkAntiCheat(userId);
if (warning) {
await bot.sendMessage(chatId, warning);
return;
}

switch (action) {
// --- Farm ---
case "farm":
await bot.sendMessage(chatId, "🌱 Bạn đã farm thành công! Hãy quay lại sau để farm tiếp.");
break;

// --- Profile ---
case "profile":
await bot.sendMessage(chatId, "👤 Đây là hồ sơ của bạn (đang phát triển).");
break;

// --- Shop ---
case "shop":
await bot.sendMessage(chatId, "🛒 Đây là cửa hàng (chưa mở bán).");
break;

// --- Settings ---
case "settings":
await bot.sendMessage(chatId, "⚙️ Menu cài đặt đang cập nhật.");
break;

// --- Help ---
case "help":
await bot.sendMessage(chatId, "ℹ️ Hướng dẫn: Dùng menu để farm, xem hồ sơ hoặc hỏi AI.");
break;

// --- AI Ask ---
case "ai_ask":
await bot.sendMessage(chatId, "🤖 Bạn muốn hỏi gì Jipu AI?");
bot.once("message", async (msg) => {
if (!msg.text) return;
const answer = await askAI(msg.from.id, msg.text);
await bot.sendMessage(chatId, answer);
});
break;

// --- NPC ---
case "npc":
const reply = await npcQuest(userId);
await bot.sendMessage(chatId, reply);
break;

default:
await bot.sendMessage(chatId, "❓ Lựa chọn không hợp lệ.");
}
} catch (err) {
console.error("❌ MenuHandler error:", err);
await bot.sendMessage(chatId, "⚠️ Lỗi hệ thống, thử lại sau.");
}
});
};
