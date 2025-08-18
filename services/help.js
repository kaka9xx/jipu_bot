// services/help.js
import { backMenuKeyboard } from "../utils/ui.js";

export async function handleHelp(bot, chatId, t, lang) {
  await bot.sendMessage(chatId, t(lang, "help_text"), backMenuKeyboard(lang, t));
}
