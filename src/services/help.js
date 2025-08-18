import { getText } from "../utils/lang.js";

export function handleHelp(bot, msg, lang) {
  bot.sendMessage(msg.chat.id, getText("help", lang));
}