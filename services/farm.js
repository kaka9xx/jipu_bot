// services/farm.js
import { actionKeyboard } from "../utils/ui.js";

export async function handleFarm(bot, chatId, userId, t, lang) {
  // ⚠️ Bạn thay phần này bằng logic thật (DB, farm points...)
  const amount = 10; 
  const farmText = t(lang, "farm_result", { amount });

  await bot.sendMessage(chatId, farmText, actionKeyboard("farm", lang, t));
}
