import { updateUser } from "../utils/db.js";

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
