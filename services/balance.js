import fs from 'fs';
import { sendMainMenu } from './menu.js';

export function handleBalance(bot, msg, t) {
  const dbPath = './database/users.json';
  let db = {};
  if (fs.existsSync(dbPath)) db = JSON.parse(fs.readFileSync(dbPath));
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  const lang = db[userId + '_lang'] || 'vi';

  const balance = db[userId]?.balance || 0;
  bot.sendMessage(chatId, t(lang, 'balance', { amount: balance }));
  sendMainMenu(bot, chatId, t, userId);
}
