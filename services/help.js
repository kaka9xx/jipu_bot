export function handleHelp(bot, msg, t) {
  const lang = "vi";
  bot.sendMessage(msg.chat.id, t(lang, "help"));
}
