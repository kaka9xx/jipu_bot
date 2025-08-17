export async function handleHelp(bot, msg, t, lang) {
  const chatId = msg.chat.id;
  const text = t(lang, "help_text");

  await bot.sendMessage(chatId, text, {
    reply_markup: { inline_keyboard: [[{ text: "⬅️ Menu", callback_data: "back_menu" }]] }
  });
}
