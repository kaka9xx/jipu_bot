import { getText } from "../utils/lang.js";

export function handleAbout(bot, msg, lang) {
  bot.sendMessage(msg.chat.id, getText("about", lang));
}