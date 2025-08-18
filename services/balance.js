// services/balance.js
import { actionKeyboard } from "../utils/ui.js";

export async function handleBalance(bot, chatId, userId, t, lang) {
  // ⚠️ Lấy balance từ DB thật
  const balance = 100; 
  const balanceText = t(lang, "balance_text", { balance });

  await bot.sendMessage(chatId, balanceText, actionKeyboard("balance", lang, t));
}
