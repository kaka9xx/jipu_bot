import { addBalance, getUser, updateUser } from "../utils/db.js";
import { mainMenu } from "../utils/i18n.js";

// 🌾 Farm
export async function handleFarm(userId) {
  const amount = Math.floor(Math.random() * 10) + 1;
  await addBalance(userId, amount);
  const text = (await mainMenu(userId, "farm")).replace("{amount}", amount);
  return { text, menu: ["⬅️"] };
}

// 💰 Balance
export async function handleBalance(userId) {
  const user = await getUser(userId);
  const text = (await mainMenu(userId, "balance")).replace("{balance}", user?.balance || 0);
  return { text, menu: ["⬅️"] };
}

// 👥 Referral
export async function handleReferral(userId) {
  const text = (await mainMenu(userId, "referral")).replace("{id}", userId);
  return { text, menu: ["⬅️"] };
}

// ❓ Help
export async function handleHelp(userId) {
  const text = await mainMenu(userId, "help");
  return { text, menu: ["⬅️"] };
}

// 📜 Intro (About)
export async function handleIntro(userId) {
  const text = await mainMenu(userId, "intro");
  return { text, menu: ["⬅️"] };
}

// 🌐 Language
export async function showLangMenu() {
  return { text: "🌐 Chọn ngôn ngữ:", menu: ["🇻🇳", "🇬🇧", "⬅️"] };
}

export async function handleLangSet(userId, lang) {
  await updateUser(userId, "lang", lang);
  return {
    text: lang === "vi" ? "✅ Đã đổi sang Tiếng Việt" : "✅ Switched to English",
    menu: ["⬅️"]
  };
}
