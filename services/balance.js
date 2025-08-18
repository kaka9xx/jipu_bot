// services/balance.js
import { actionKeyboard } from "../utils/ui.js";

export async function handleBalance(bot, chatId, userId, t, lang) {
  // TODO: thay bằng DB thật của bạn
  const u = (global.__users && global.__users.get(userId)) || { balance: 0 };
  const msg = t(lang, "balance_text", { balance: u.balance });
  // Refresh dùng callback "balance" sẵn có trong index.js
  await bot.sendMessage(chatId, msg, actionKeyboard("balance", lang, t));
}
