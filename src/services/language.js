// services/lang.js
import { updateUser, findUser } from "../utils/db.js";
import { getText } from "../utils/lang.js";
import { mainMenu } from "./menu.js";

export function handleLanguage(ctx) {
  ctx.reply("🌐 Chọn ngôn ngữ:", {
    reply_markup: {
      keyboard: [
        [{ text: "🇻🇳 Tiếng Việt" }, { text: "🇬🇧 English" }],
        [{ text: "⬅️ Về menu" }]
      ],
      resize_keyboard: true
    }
  });
}

export function setLanguage(ctx, lang) {
  const id = ctx.from.id;
  let user = findUser(id);
  if (user) {
    updateUser(id, { lang });
  }
  const text = getText("lang_changed", lang);
  ctx.reply(text, mainMenu());
}
