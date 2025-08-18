import { addBalance, getUser } from "../utils/db.js";
import { mainMenu } from "../utils/i18n.js";

export async function handleFarm(userId) {
  const amount = Math.floor(Math.random() * 10) + 1;
  await addBalance(userId, amount);
  const text = (await mainMenu(userId, "farm")).replace("{amount}", amount);
  return { text, menu: ["⬅️"] };
}
