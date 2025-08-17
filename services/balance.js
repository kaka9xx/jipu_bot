import { loadDB } from "../utils/db.js";

export async function handleBalance(bot, msg, t, lang) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  const db = loadDB();
  const bal = db[userId]?.balance || 0;

  const text = t(lang, "balance_text", { balance: bal });
  await bot.sendMessage(chatId, text, {
    reply_markup: { inline_keyboard: [[{ text: "⬅️ Menu", callback_data: "back_menu" }]] }
  });
}
