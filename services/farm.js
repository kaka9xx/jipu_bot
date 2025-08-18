export async function handleFarm(bot, chatId, userId, t, lang) {
  // Mock: mỗi lần farm +10 điểm
  const gain = 10;
  const balance = Math.floor(Math.random() * 100) + gain;

  await bot.sendMessage(
    chatId,
    t(lang, "farm_ok", { gain, balance }),
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "⬅️ " + t(lang, "back_menu"), callback_data: "back_menu" }]
        ]
      }
    }
  );
}
