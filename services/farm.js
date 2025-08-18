// services/farm.js
import { actionKeyboard } from "../utils/ui.js";

export async function handleFarm(bot, chatId, userId, t, lang) {
  // TODO: thay bằng DB thật của bạn
  global.__users = global.__users || new Map();
  const u = global.__users.get(userId) || { balance: 0 };
  const gain = Math.floor(Math.random() * 10) + 1;
  u.balance += gain;
  global.__users.set(userId, u);

  const msg = t(lang, "farm_ok", { gain, balance: u.balance });
  // Refresh dùng callback "farm" sẵn có trong index.js
  await bot.sendMessage(chatId, msg, actionKeyboard("farm", lang, t));
}
