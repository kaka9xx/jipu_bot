import fs from 'fs';
import { sendMainMenu } from './menu.js';

export function handleReferral(bot, msg, t) {
  const dbPath = './database/users.json';
  let db = {};
  if (fs.existsSync(dbPath)) db = JSON.parse(fs.readFileSync(dbPath));
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  const lang = db[userId + '_lang'] || 'vi';

  const link = `https://t.me/${process.env.BOT_USERNAME}?start=${userId}`;
  bot.sendMessage(chatId, t(lang, 'ref', { link }));
  sendMainMenu(bot, chatId, t, userId);
}
