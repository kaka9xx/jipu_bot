// src/utils/menu.js
export function mainMenu(lang) {
  return {
    keyboard: [
      [{ text: "🌾 " + lang.farm }, { text: "💰 " + lang.balance }],
      [{ text: "👥 " + lang.referral }, { text: "🌐 " + lang.language }],
      [{ text: "❓ " + lang.help }, { text: "ℹ️ " + lang.about }],
    ],
    resize_keyboard: true,
  };
}
