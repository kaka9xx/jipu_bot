// services/referral.js
import { backMenuKeyboard } from "../utils/ui.js";

export async function handleReferral(bot, chatId, userId, t, lang, BOT_USERNAME) {
  const link = `https://t.me/${BOT_USERNAME}?start=${userId}`;
  const msg = t(lang, "referral_text", { link });
  await bot.sendMessage(chatId, msg, backMenuKeyboard(lang, t));
}
