export async function handleBalance(bot, chatId, userId, t, lang) {
  // Mock: trả số dư ngẫu nhiên
  const balance = Math.floor(Math.random() * 500);

  await bot.sendMessage(
    chatId,
    t(lang, "balance_text", { balance }),
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "⬅️ " + t(lang, "back_menu"), callback_data: "back_menu" }]
        ]
      }
    }
  );
}
