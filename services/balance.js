export function handleBalance(bot, msg, t) {
  const lang = "vi";
  const amount = 100;
  bot.sendMessage(msg.chat.id, t(lang, "balance", { amount }));
}
