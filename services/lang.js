// services/lang.js
import { backMenuKeyboard } from "../utils/ui.js";
import { setUserLang } from "../utils/db.js";

// Hiện menu chọn ngôn ngữ
export async function showLangMenu(bot, chatId, t) {
  await bot.sendMessage(chatId, t("vi", "lang_choose"), {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🇻🇳 Tiếng Việt", callback_data: "set_lang:vi" },
          { text: "🇬🇧 English", callback_data: "set_lang:en" }
        ],
        [{ text: "⬅️ " + t("vi", "back_menu"), callback_data: "back_menu" }]
      ]
    }
  });
}

// Cập nhật ngôn ngữ của user (được index.js gọi)
export async function handleLangSet(bot, chatId, userId, newLang, t) {
  await setUserLang(userId, newLang);      // dùng DB thật của bạn
  await bot.sendMessage(chatId, t(newLang, "lang_set_ok"), backMenuKeyboard(newLang, t));
}
