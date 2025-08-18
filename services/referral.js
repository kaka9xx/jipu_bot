export async function handleReferral(bot, chatId, userId, t, lang, BOT_USERNAME) {
  const link = `https://t.me/${BOT_USERNAME}?start=${userId}`;

  await bot.sendMessage(
    chatId,
    t(lang, "referral_text", { link }),
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "⬅️ " + t(lang, "back_menu"), callback_data: "back_menu" }]
        ]
      }
    }
  );
}
