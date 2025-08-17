import fs from 'fs';

export function handleReferral(bot, msg, t, lang) {
  const db = JSON.parse(fs.readFileSync('./database/users.json', 'utf8'));

  if (!db[msg.from.id]) {
    db[msg.from.id] = { balance: 0, referrals: [] };
  }

  const refLink = `https://t.me/${process.env.BOT_USERNAME}?start=${msg.from.id}`;
  bot.sendMessage(
    msg.chat.id,
    t(lang, 'referral', { link: refLink })
  );
}
