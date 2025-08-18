import { mainMenu } from "../utils/i18n.js";

export async function handleIntro(userId) {
  const text = await mainMenu(userId, "intro");
  return { text, menu: ["⬅️"] };
}
