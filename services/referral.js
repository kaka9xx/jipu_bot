export function handleReferral(bot, msg, t) {
  const lang = "vi";
  const link = `https://t.me/yourbot?start=${msg.from.id}`;
  bot.sendMessage(msg.chat.id, t(lang, "ref", { link }));
}
