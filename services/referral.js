// services/referral.js
import { backMenuKeyboard } from "../utils/ui.js";

export async function handleReferral(bot, chatId, t, lang) {
  const link = `https://t.me/your_bot?start=${chatId}`;
  const msg = t(lang, "referral_text").replace("{link}", link);

  await bot.sendMessage(chatId, msg, backMenuKeyboard(lang, t));
}
