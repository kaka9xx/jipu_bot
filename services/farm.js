import fs from 'fs';

export function handleFarm(bot, msg, t, lang) {
  const db = JSON.parse(fs.readFileSync('./database/users.json', 'utf8'));

  if (!db[msg.from.id]) {
    db[msg.from.id] = { balance: 0 };
  }

  db[msg.from.id].balance += 10;

  fs.writeFileSync('./database/users.json', JSON.stringify(db, null, 2));

  bot.sendMessage(
    msg.chat.id,
    t(lang, 'farm', { amount: 10, balance: db[msg.from.id].balance })
  );
}
