export function handleLang(bot, msg, t) {
  bot.sendMessage(msg.chat.id, t("vi", "lang"), {
    reply_markup: {
      keyboard: [[{ text: "🇻🇳 Tiếng Việt" }, { text: "🇬🇧 English" }]],
      resize_keyboard: true
    }
  });
}

export function handleLangChoice(bot, msg, t) {
  if (msg.text === "🇻🇳 Tiếng Việt") {
    bot.sendMessage(msg.chat.id, "✅ Đã đổi sang Tiếng Việt!");
  } else if (msg.text === "🇬🇧 English") {
    bot.sendMessage(msg.chat.id, "✅ Switched to English!");
  }
}
