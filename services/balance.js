import fs from 'fs';

export function handleBalance(bot, msg, t, lang) {
  const db = JSON.parse(fs.readFileSync('./database/users.json', 'utf8'));
  const balance = db[msg.from.id]?.balance || 0;

  bot.sendMessage(msg.chat.id, t(lang, 'balance', { balance }));
}
