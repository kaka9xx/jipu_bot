import fs from 'fs';

export function handleLang(bot, msg, t) {
  const dbPath = './database/users.json';
  const db = JSON.parse(fs.readFileSync(dbPath));
  const userId = msg.from.id;
  const lang = db[userId + '_lang'] || 'vi';

  bot.sendMessage(msg.chat.id, "🌍 Chọn ngôn ngữ:", {
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

export function handleLangChoice(bot, msg, t) {
  if (!msg.data) return; // chỉ xử lý callback
  const dbPath = './database/users.json';
  const db = JSON.parse(fs.readFileSync(dbPath));
  const userId = msg.from.id;

  if (msg.data === "set_lang_vi") {
    db[userId + '_lang'] = 'vi';
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    bot.sendMessage(msg.message.chat.id, "✅ Đã chuyển sang Tiếng Việt");
  }
  if (msg.data === "set_lang_en") {
    db[userId + '_lang'] = 'en';
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    bot.sendMessage(msg.message.chat.id, "✅ Language set to English");
  }
}
