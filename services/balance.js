import fs from 'fs';

export function handleBalance(bot, msg, t) {
  const dbPath = './database/users.json';
  const db = JSON.parse(fs.readFileSync(dbPath));
  const userId = msg.from.id;
  const lang = db[userId + '_lang'] || 'vi';

  const bal = db[userId]?.balance || 0;
  bot.sendMessage(msg.chat.id, t(lang, 'balance', { amount: bal }));
}
