// services/referral.js
import { backMenuKeyboard } from "../utils/ui.js";

export async function handleReferral(bot, chatId, userId, t, lang, botUsername) {
  const refLink = `https://t.me/${botUsername}?start=${userId}`;
  const refText = t(lang, "ref_text", { link: refLink });

  await bot.sendMessage(chatId, refText, backMenuKeyboard(lang, t));
}
