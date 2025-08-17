import fs from 'fs';
import { sendMainMenu } from './menu.js';
import { backToMenuButton } from "./menu.js";

export function handleHelp(bot, msg, t) {
  const dbPath = './database/users.json';
  let db = {};
  if (fs.existsSync(dbPath)) db = JSON.parse(fs.readFileSync(dbPath));
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  const lang = db[userId + '_lang'] || 'vi';

  bot.sendMessage(chatId, t(lang, 'help'));
  sendMainMenu(bot, chatId, t, userId);
}
// services/help.js


export function handleHelp(bot, msg, t, lang) {
  bot.sendMessage(
    msg.chat.id,
    t(lang, "help_text") ||
      "ℹ️ Các lệnh khả dụng:\n/farm - Farm JIPU\n/balance - Xem số dư\n/ref - Lấy link giới thiệu\n/lang - Đổi ngôn ngữ",
    backToMenuButton(t, lang)
  );
}