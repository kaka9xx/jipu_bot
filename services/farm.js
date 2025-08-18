// services/farm.js
import { backMenuKeyboard } from "../utils/ui.js";

export async function handleFarm(bot, chatId, t, lang, user) {
  const gain = Math.floor(Math.random() * 10) + 1;
  user.balance = (user.balance || 0) + gain;

  const msg = t(lang, "farm_ok")
    .replace("{gain}", gain)
    .replace("{balance}", user.balance);

  await bot.sendMessage(chatId, msg, backMenuKeyboard(lang, t));
}
