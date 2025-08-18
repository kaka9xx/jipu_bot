import { mainMenu } from "../utils/i18n.js";
import { getText } from "../utils/lang.js";
import { addUser } from "../utils/db.js";
import { mainMenu } from "./menu.js";

export function handleStart(ctx) {
  const id = ctx.from.id;
  const name = ctx.from.first_name || "User";

  // thêm vào DB nếu chưa có
  addUser(id, name);

  const text = getText("start", "vi"); // mặc định tiếng Việt
  ctx.reply(text, mainMenu());
}



export async function handleIntro(userId) {
  const text = await mainMenu(userId, "intro");
  return { text, menu: ["⬅️"] };
}
