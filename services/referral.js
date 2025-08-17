export function handleReferral(bot, msg, t, lang) {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "👥 Đây là link giới thiệu của bạn: https://t.me/jipu_bot?start=ref123", { parse_mode: "Markdown" });
}