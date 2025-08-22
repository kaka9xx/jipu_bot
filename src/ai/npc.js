// src/ai/npc.js
const User = require("../models/User");

async function npcQuest(userId) {
const user = await User.findOne({ telegramId: userId });

if (!user) return "🤖 NPC: Bạn chưa đăng ký!";

if (user.farmCount < 5) {
return "🌱 NPC: Hãy farm đủ 5 lần để nhận phần thưởng đầu tiên!";
} else {
return "🎉 NPC: Bạn đã farm chăm chỉ, giờ thử mời bạn bè để nhận bonus nhé!";
}
}

module.exports = { npcQuest };
