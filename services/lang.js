import { loadDB, saveDB } from "../utils/db.js";

export async function handleLang(bot, msg, t) {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, "🌐 Choose your language:", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🇻🇳 Tiếng Việt", callback_data: "lang_vi" },
          { text: "🇺🇸 English", callback_data: "lang_en" }
        ]
      ]
    }
  });
}

export async function handleLangChoice(bot, query, t) {
  const userId = query.from.id;
  const chatId = query.message.chat.id;
  const db = loadDB();

  if (query.data === "lang_vi") db[userId + "_lang"] = "vi";
  if (query.data === "lang_en") db[userId + "_lang"] = "en";
  saveDB(db);

  const lang = db[userId + "_lang"];
  await bot.sendMessage(chatId, t(lang, "lang_changed"), {
    reply_markup: { inline_keyboard: [[{ text: "⬅️ Menu", callback_data: "back_menu" }]] }
  });
}
