export function handleFarm(bot, msg, t) {
  const lang = "vi";
  bot.sendMessage(msg.chat.id, t(lang, "farm"), {
    reply_markup: { keyboard: [[{ text: "/menu" }]], resize_keyboard: true }
  });
}
