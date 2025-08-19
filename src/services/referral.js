import { getText } from "../utils/lang.js";

export function handleReferral(bot, msg, user) {
  const link = `https://t.me/jipu_farm_bot?start=${user.referral_code}`;
  bot.sendMessage(msg.chat.id, `${getText("referral", user.lang)}:\n${link}`);
}