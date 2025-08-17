export function handleHelp(bot, msg, t, lang) {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, t(lang, "help"), { parse_mode: "Markdown" });
}