import { addBalance, getBalance } from "../utils/db.js";

export async function handleFarm(bot, chatId, userId, t, lang) {
  const gain = 1; // mỗi lần farm +1
  const newBal = await addBalance(userId, gain);
  const msg = t(lang, "farm_ok", { gain, balance: newBal });
  await bot.sendMessage(chatId, msg);
}
