// services/lang.js
import { backMenuKeyboard } from "../utils/ui.js";
import { setUserLang } from "../utils/db.js";

export async function showLangMenu(bot, chatId, t) {
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🇻🇳 Tiếng Việt", callback_data: "set_lang:vi" },
          { text: "🇬🇧 English", callback_data: "set_lang:en" }
        ],
        [{ text: "⬅️ " + t("vi", "back_menu"), callback_data: "back_menu" }]
      ]
    }
  };

  await bot.sendMessage(chatId, "🌍 Choose your language / Chọn ngôn ngữ:", keyboard);
}

export async function handleLangSet(bot, chatId, userId, newLang, t) {
  await setUserLang(userId, newLang);
  await bot.sendMessage(chatId, t(newLang, "lang_updated"), backMenuKeyboard(newLang, t));
}
