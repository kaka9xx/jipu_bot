import fs from 'fs';
import { sendMainMenu } from './menu.js';
import { backToMenuButton } from "./menu.js";

export function handleFarm(bot, msg, t) {
  const dbPath = './database/users.json';
  let db = {};
  if (fs.existsSync(dbPath)) db = JSON.parse(fs.readFileSync(dbPath));
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  const lang = db[userId + '_lang'] || 'vi';

  if (!db[userId]) db[userId] = { balance: 0 };
  db[userId].balance += 1;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  bot.sendMessage(chatId, t(lang, 'farm'));
  sendMainMenu(bot, chatId, t, userId);
}

// services/farm.js

export function handleFarm(bot, msg, t, lang) {
  bot.sendMessage(
    msg.chat.id,
    t(lang, "farm_result") || "⚔️ Bạn vừa farm xong, sức mạnh JIPU tăng lên!",
    backToMenuButton(t, lang)
  );
}