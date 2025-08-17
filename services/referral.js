export function handleReferral(bot, msg, t) {
  const db = JSON.parse(fs.readFileSync('./database/users.json'));
  const lang = db[msg.from.id + '_lang'] || 'vi';
  const refLink = `https://t.me/your_bot_username?start=${msg.from.id}`;
  bot.sendMessage(msg.chat.id, t(lang, 'ref', { LINK: refLink }));
}