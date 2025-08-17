export function handleHelp(bot, msg, t, lang) {
  bot.sendMessage(msg.chat.id, t(lang, 'help'));
}
