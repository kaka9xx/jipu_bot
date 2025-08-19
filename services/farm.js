import { addBalance, getUser } from "../utils/db.js";
import { mainMenu } from "../utils/i18n.js";

import { getText } from "../utils/lang.js";
import { findUser, updateUser } from "../utils/db.js";
import { backMenu } from "./menu.js";

export function handleFarm(ctx) {
  const user = findUser(ctx.from.id);
  if (!user) {
    ctx.reply("❌ Bạn chưa đăng ký. Hãy gõ /start trước.");
    return;
  }

  const earned = Math.floor(Math.random() * 10) + 1; // random 1-10
  const newBalance = user.balance + earned;

  updateUser(user.id, { balance: newBalance });

  const text = getText("farm", user.lang).replace("{amount}", earned);
  ctx.reply(text, backMenu());
}


export async function handleFarm(userId) {
  const amount = Math.floor(Math.random() * 10) + 1;
  await addBalance(userId, amount);
  const text = (await mainMenu(userId, "farm")).replace("{amount}", amount);
  return { text, menu: ["⬅️"] };
}
