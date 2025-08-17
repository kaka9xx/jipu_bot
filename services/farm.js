import fs from 'fs';

export function handleFarm(bot, msg, t) {
  const db = JSON.parse(fs.readFileSync('./database/users.json'));
  if (!db[msg.from.id]) db[msg.from.id] = 0;
  db[msg.from.id] += 10; // farm 10 energy
  fs.writeFileSync('./database/users.json', JSON.stringify(db, null, 2));

  const lang = db[msg.from.id + '_lang'] || 'vi';
  const reply = t(lang, 'farm_success', { EARNED: 10, TOTAL: db[msg.from.id] });
  bot.sendMessage(msg.chat.id, reply);
}
