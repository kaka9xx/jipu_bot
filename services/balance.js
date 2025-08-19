import { getUser } from "../utils/db.js";
import { mainMenu } from "../utils/i18n.js";

import { getText } from "../utils/lang.js";
import { findUser } from "../utils/db.js";
import { backMenu } from "./menu.js";

export function handleBalance(ctx) {
  const user = findUser(ctx.from.id);
  if (!user) {
    ctx.reply("❌ Bạn chưa đăng ký. Hãy gõ /start trước.");
    return;
  }

  const text = getText("balance", user.lang).replace("{amount}", user.balance);
  ctx.reply(text, backMenu());
}


export async function handleBalance(userId) {
  const user = await getUser(userId);
  const text = (await mainMenu(userId, "balance")).replace("{balance}", user?.balance || 0);
  return { text, menu: ["⬅️"] };
}
