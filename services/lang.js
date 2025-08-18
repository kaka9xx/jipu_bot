// services/lang.js
import { backMenuKeyboard } from "../utils/ui.js";

export async function handleLang(bot, chatId, t, lang) {
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🇻🇳 Tiếng Việt", callback_data: "set_lang_vi" }],
        [{ text: "🇬🇧 English", callback_data: "set_lang_en" }],
        [{ text: t(lang, "back_menu"), callback_data: "back_menu" }]
      ]
    }
  };

  await bot.sendMessage(chatId, t(lang, "lang_choose"), opts);
}

export async function setLang(bot, chatId, t, lang, newLang, users) {
  users[chatId].lang = newLang;
  await bot.sendMessage(chatId, t(newLang, "lang_set_ok"), backMenuKeyboard(newLang, t));
}
