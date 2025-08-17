export async function handleReferral(bot, msg, t, lang) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  const link = `https://t.me/${bot.username}?start=${userId}`;
  const text = t(lang, "referral_text", { link });

  await bot.sendMessage(chatId, text, {
    reply_markup: { inline_keyboard: [[{ text: "⬅️ Menu", callback_data: "back_menu" }]] }
  });
}
