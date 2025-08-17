import fs from 'fs';

export function sendMainMenu(bot, chatId, t, userId) {
  const dbPath = './database/users.json';
  let db = {};
  if (fs.existsSync(dbPath)) db = JSON.parse(fs.readFileSync(dbPath));
  const lang = db[userId + '_lang'] || 'vi';

  bot.sendMessage(chatId, t(lang, 'start'), {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "⚔️ Farm", callback_data: "farm" },
          { text: "💰 Balance", callback_data: "balance" },
          { text: "👥 Referral", callback_data: "ref" }
        ],
        [
          { text: "ℹ️ Help", callback_data: "help" },
          { text: "🌍 Language", callback_data: "lang" }
        ]
      ]
    },
    parse_mode: "Markdown"
  });
}
