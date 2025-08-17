import fs from "fs";
import { getMainMenu } from "./menu.js";

export function handleLang(bot, msg, t) {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "🌐 Chọn ngôn ngữ / Choose language:", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🇻🇳 Tiếng Việt", callback_data: "set_lang_vi" },
          { text: "🇬🇧 English", callback_data: "set_lang_en" }
        ]
      ]
    }
  });
}

export function handleLangChoice(bot, query, t) {
  const chatId = query.message.chat.id;
  const userId = query.from.id;

  if (query.data === "set_lang_vi" || query.data === "set_lang_en") {
    const lang = query.data === "set_lang_vi" ? "vi" : "en";

    // Lưu DB
    const dbPath = "./database/users.json";
    let db = {};
    if (fs.existsSync(dbPath)) {
      db = JSON.parse(fs.readFileSync(dbPath));
    }
    db[userId + "_lang"] = lang;
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    // Phản hồi
    bot.sendMessage(
      chatId,
      `✅ ${lang === "vi" ? "Đã đổi sang 🇻🇳 Tiếng Việt" : "Language switched to 🇬🇧 English"}`
    );

    // Cập nhật lại menu theo ngôn ngữ mới
    bot.sendMessage(chatId, t(lang, "choose_next"), getMainMenu(t, lang));
  }
}
