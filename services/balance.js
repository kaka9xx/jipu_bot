import { getBalance } from "../utils/db.js";

export async function handleBalance(bot, chatId, userId, t, lang) {
  const bal = await getBalance(userId);
  await bot.sendMessage(chatId, t(lang, "balance_text", { balance: bal }));
}
