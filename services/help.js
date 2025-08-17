export async function handleHelp(bot, chatId, t, lang) {
  await bot.sendMessage(chatId, t(lang, "help_text"), { disable_web_page_preview: true });
}
