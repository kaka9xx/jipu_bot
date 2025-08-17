import fs from 'fs';
import { sendMainMenu } from './menu.js';

export function handleLang(bot, msg, t) {
  bot.sendMessage(msg.chat.id, "🌍 Select language / Chọn ngôn ngữ:", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🇻🇳 Tiếng Việt", callback_data: "set_lang_vi" },
          { text: "🇬🇧 English", callback_data: "set_lang_en" }
        ],
        [{ text: "⬅️ Back", callback_data: "back_menu" }]
      ]
    }
  });
}

export function handleLangChoice(bot, query, t) {
  const dbPath = './database/users.json';
  let db = {};
  if (fs.existsSync(dbPath)) db = JSON.parse(fs.readFileSync(dbPath));
  const userId = query.from.id;
  const chatId = query.message.chat.id;

  if (query.data === "set_lang_vi") {
    db[userId + '_lang'] = 'vi';
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    bot.sendMessage(chatId, "✅ Đã chuyển sang Tiếng Việt");
    sendMainMenu(bot, chatId, t, userId);
  }

  if (query.data === "set_lang_en") {
    db[userId + '_lang'] = 'en';
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    bot.sendMessage(chatId, "✅ Language set to English");
    sendMainMenu(bot, chatId, t, userId);
  }
}
