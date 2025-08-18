export async function handleHelp(bot, chatId, t, lang) {
  await bot.sendMessage(
    chatId,
    t(lang, "help_text"),
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "⬅️ " + t(lang, "back_menu"), callback_data: "back_menu" }]
        ]
      }
    }
  );
}
