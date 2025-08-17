export function handleFarm(bot, msg, t, lang) {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "🌱 Bạn đã farm được 10 JIPU!", { parse_mode: "Markdown" });
}