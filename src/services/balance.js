import { getText } from "../utils/lang.js";

export function handleBalance(bot, msg, user) {
  bot.sendMessage(msg.chat.id, `${getText("balance", user.lang)}: ${user.balance}`);
}