import { mainMenu } from "../utils/i18n.js";

export async function handleReferral(userId) {
  const text = (await mainMenu(userId, "referral")).replace("{id}", userId);
  return { text, menu: ["⬅️"] };
}
