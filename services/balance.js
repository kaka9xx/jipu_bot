import fs from 'fs';

export function handleBalance(bot, msg, t) {
  const db = JSON.parse(fs.readFileSync('./database/users.json'));
  const total = db[msg.from.id] || 0;
  const lang = db[msg.from.id + '_lang'] || 'vi';
  bot.sendMessage(msg.chat.id, t(lang, 'balance', { TOTAL: total }));
}
