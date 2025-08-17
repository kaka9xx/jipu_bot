import fs from 'fs';
import { sendMainMenu } from './menu.js';
import { backToMenuButton } from "./menu.js";

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

// services/balance.js


export function handleBalance(bot, msg, t, lang) {
  bot.sendMessage(
    msg.chat.id,
    t(lang, "balance_result") || "💰 Số dư hiện tại của bạn: 100 JIPU",
    backToMenuButton(t, lang)
  );
}