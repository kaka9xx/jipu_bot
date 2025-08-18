import { getUser } from "../utils/db.js";
import { mainMenu } from "../utils/i18n.js";

export async function handleBalance(userId) {
  const user = await getUser(userId);
  const text = (await mainMenu(userId, "balance")).replace("{balance}", user?.balance || 0);
  return { text, menu: ["⬅️"] };
}
