// services/balance.js
import { backMenuKeyboard } from "../utils/ui.js";

export async function handleBalance(bot, chatId, t, lang, user) {
  const msg = t(lang, "balance_text").replace("{balance}", user.balance || 0);
  await bot.sendMessage(chatId, msg, backMenuKeyboard(lang, t));
}
