export function handleBalance(bot, msg, t, lang) {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "💰 Số dư hiện tại: 100 JIPU", { parse_mode: "Markdown" });
}