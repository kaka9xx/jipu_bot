// src/ai/npc.js
const User = require("../models/User");

async function handleNPC(bot, chatId, userId) {
  const user = await User.findOne({ telegramId: userId });
  if (!user) {
    await bot.sendMessage(chatId, "❌ Bạn chưa có hồ sơ. Gõ /start trước nhé.");
    return;
  }

  let npcMsg = "👋 Chào nhà nông mới!";
  if (user.farmCount > 50) {
    npcMsg = "🌾 Bạn đã farm hơn 50 lần, NPC giao nhiệm vụ nâng cấp trang trại!";
  } else if (user.joinedAt && (Date.now() - user.joinedAt.getTime()) < 7*24*3600*1000) {
    npcMsg = "🎁 Người mới trong 7 ngày, NPC tặng bạn phần thưởng newbie!";
  }

  await bot.sendMessage(chatId, npcMsg);
}

module.exports = { handleNPC };
