import fs from 'fs';
const DB_PATH = './database/users.json';

export async function farmCoins(userId) {
  const db = JSON.parse(fs.readFileSync(DB_PATH));
  if (!db[userId]) {
    db[userId] = 0;
  }
  const earned = 10;
  db[userId] += earned;
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  return { earned, total: db[userId] };
}