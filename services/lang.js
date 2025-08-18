// Hiển thị menu chọn ngôn ngữ
export async function showLangMenu(bot, chatId, t) {
  await bot.sendMessage(chatId, t("vi", "lang_choose"), {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🇻🇳 Tiếng Việt", callback_data: "set_lang:vi" }],
        [{ text: "🇬🇧 English", callback_data: "set_lang:en" }],
        [{ text: "⬅️ " + t("vi", "back_menu"), callback_data: "back_menu" }]
      ]
    }
  });
}

// Cập nhật ngôn ngữ (mock)
export async function handleLangSet(bot, chatId, userId, newLang, t) {
  await bot.sendMessage(chatId, t(newLang, "lang_set_ok"));
}
