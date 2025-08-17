import fs from 'fs';

export function handleFarm(bot, msg, t) {
  const dbPath = './database/users.json';
  const db = JSON.parse(fs.readFileSync(dbPath));
  const userId = msg.from.id;
  const lang = db[userId + '_lang'] || 'vi';

  // khởi tạo nếu chưa có
  if (!db[userId]) db[userId] = { balance: 0 };

  db[userId].balance += 1;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  bot.sendMessage(msg.chat.id, t(lang, 'farm'));
}
