// services/help.js
import { backMenuKeyboard } from "../utils/ui.js";

export async function handleHelp(bot, chatId, t, lang) {
  const helpText = t(lang, "help_text");

  await bot.sendMessage(chatId, helpText, backMenuKeyboard(lang, t));
}
