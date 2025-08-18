export function mainMenu(lang) {
  return {
    keyboard: [
      [{ text: "🌾 Farm" }, { text: "💰 Balance" }],
      [{ text: "👥 Referral" }, { text: "❓ Help" }],
      [{ text: "🌐 Language" }, { text: "📜 About" }],
    ],
    resize_keyboard: true,
  };
}