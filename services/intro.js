// services/intro.js
import { backMenuKeyboard } from "../utils/ui.js";

export async function handleIntro(bot, chatId, t, lang) {
  await bot.sendMessage(chatId, t(lang, "about_text"), backMenuKeyboard(lang, t));
}
