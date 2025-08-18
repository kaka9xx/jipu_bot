import { mainMenu } from "../utils/i18n.js";

export async function handleHelp(userId) {
  const text = await mainMenu(userId, "help");
  return { text, menu: ["⬅️"] };
}
