import fs from 'fs';

export function handleHelp(bot, msg, t) {
  const db = JSON.parse(fs.readFileSync('./database/users.json'));
  const lang = db[msg.from.id + '_lang'] || 'vi';
  bot.sendMessage(msg.chat.id, t(lang, 'help'));
}
