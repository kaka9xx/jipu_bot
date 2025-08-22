// src/ai/antiCheat.js
const userClicks = new Map(); // { userId: [timestamps] }

function detectCheat(userId) {
  const now = Date.now();
  if (!userClicks.has(userId)) userClicks.set(userId, []);
  const clicks = userClicks.get(userId);

  clicks.push(now);
  if (clicks.length > 10) clicks.shift(); // giữ 10 lần gần nhất

  if (clicks.length >= 5) {
    const intervals = [];
    for (let i = 1; i < clicks.length; i++) {
      intervals.push(clicks[i] - clicks[i - 1]);
    }
    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.map(x => (x - avg) ** 2).reduce((a, b) => a + b, 0) / intervals.length;

    if (avg < 1500 || variance < 100) { // spam hoặc click đều bất thường
      return true;
    }
  }
  return false;
}

async function handleReport(bot, chatId, userId) {
  const cheated = detectCheat(userId);
  if (cheated) {
    await bot.sendMessage(chatId, "🚨 Phát hiện hành vi bất thường! Bạn có thể bị kiểm tra.");
  } else {
    await bot.sendMessage(chatId, "✅ Hành vi của bạn bình thường.");
  }
}

module.exports = { handleReport };
