import fs from 'fs';

export function handleReferral(bot, msg, t) {
  const dbPath = './database/users.json';
  const db = JSON.parse(fs.readFileSync(dbPath));
  const userId = msg.from.id;
  const lang = db[userId + '_lang'] || 'vi';

  // link referral (BOT_USERNAME lấy từ .env)
  const link = `https://t.me/${process.env.BOT_USERNAME}?start=${userId}`;
  bot.sendMessage(msg.chat.id, t(lang, 'ref', { link }));
}
