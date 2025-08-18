import { updateUser } from "../utils/db.js";
import { getText } from "../utils/lang.js";

export function handleLanguage(bot, msg) {
  bot.sendMessage(msg.chat.id, "🌐 Select language / Chọn ngôn ngữ", {
    reply_markup: {
      keyboard: [
        [{ text: "🇻🇳 Tiếng Việt" }, { text: "🇬🇧 English" }],
        [{ text: "⬅️ Menu" }]
      ],
      resize_keyboard: true
    }
  });
}

export function handleLangSwitch(bot, msg, lang) {
  updateUser(msg.from.id, { lang });
  bot.sendMessage(msg.chat.id, getText("lang_changed", lang));
}