import { setUserLang } from "../utils/db.js";

export async function showLangMenu(bot, chatId, t) {
  const inline_keyboard = [
    [
      { text: "🇻🇳 Tiếng Việt", callback_data: "set_lang:vi" },
      { text: "🇬🇧 English",   callback_data: "set_lang:en" }
    ]
  ];
  await bot.sendMessage(chatId, t("vi", "lang_choose"), {
    reply_markup: { inline_keyboard }
  });
}

export async function handleLangSet(bot, chatId, userId, newLang, t) {
  await setUserLang(userId, newLang);
  await bot.sendMessage(chatId, t(newLang, "lang_set_ok"));
}
