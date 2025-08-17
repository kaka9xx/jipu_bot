import fs from 'fs';

export function handleLang(bot, msg, t) {
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🇻🇳 Tiếng Việt", callback_data: "lang_vi" },
          { text: "🇬🇧 English", callback_data: "lang_en" }
        ]
      ]
    }
  };
  bot.sendMessage(msg.chat.id, "🌐 Chọn ngôn ngữ / Choose language:", opts);
}

export function handleLangChoice(bot, msg, t) {
  if (!msg.data) return;

  if (msg.data.startsWith("lang_")) {
    const lang = msg.data.split("_")[1];
    const db = JSON.parse(fs.readFileSync('./database/users.json', 'utf8'));
    db[msg.from.id + '_lang'] = lang;
    fs.writeFileSync('./database/users.json', JSON.stringify(db, null, 2));

    bot.answerCallbackQuery(msg.id, { text: `Ngôn ngữ đã đổi: ${lang}` });
    bot.sendMessage(msg.message.chat.id, t(lang, 'lang_changed'));
  }
}
