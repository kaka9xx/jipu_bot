import fs from "fs";
const LANG_PATH = "./lang.json";

export function getText(lang) {
  const texts = JSON.parse(fs.readFileSync(LANG_PATH));
  return texts[lang] || texts["vi"];
}

export function mainMenu(lang) {
  return [
    [{ text: "🌾 Farm" }, { text: "💰 Balance" }],
    [{ text: "👥 Referral" }],
    [{ text: "🌐 Language" }],
    [{ text: "❓ Help" }, { text: "📜 About" }]
  ];
}
