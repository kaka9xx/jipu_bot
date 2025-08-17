import { getUser } from "../utils/db.js";

export async function handleReferral(bot, chatId, userId, t, lang, botUsername) {
  await getUser(userId); // đảm bảo user tồn tại trong DB
  const link = `https://t.me/${botUsername}?start=${userId}`;
  const text = t(lang, "referral_text", { link });
  await bot.sendMessage(chatId, text, { disable_web_page_preview: true });
}
