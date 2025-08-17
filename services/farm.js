import { loadDB, saveDB } from "../utils/db.js";

export async function handleFarm(bot, msg, t, lang) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  const db = loadDB();

  if (!db[userId]) db[userId] = { balance: 0 };

  const gain = Math.floor(Math.random() * 10) + 1; // năng lượng random
  db[userId].balance += gain;
  saveDB(db);

  const text = t(lang, "farm_ok", { gain, balance: db[userId].balance });
  await bot.sendMessage(chatId, text, {
    reply_markup: { inline_keyboard: [[{ text: "⬅️ Menu", callback_data: "back_menu" }]] }
  });
}
