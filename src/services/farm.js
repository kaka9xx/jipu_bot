import { updateUser } from "../utils/db.js";
import { getText } from "../utils/lang.js";

export function handleFarm(bot, msg, user) {
  const earn = Math.floor(Math.random() * 10) + 1;
  const newBalance = (user.balance || 0) + earn;

  updateUser(user.user_id, { balance: newBalance });
  bot.sendMessage(msg.chat.id, `${getText("farmed", user.lang)} +${earn} 💰\n${getText("balance", user.lang)}: ${newBalance}`);
}