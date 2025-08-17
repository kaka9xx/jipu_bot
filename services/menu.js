export function getMainMenu(t, lang) {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "⚔️ " + t(lang, "farm"), callback_data: "farm" },
          { text: "💎 " + t(lang, "balance"), callback_data: "balance" }
        ],
        [
          { text: "👥 " + t(lang, "referral"), callback_data: "ref" },
          { text: "🌐 " + t(lang, "lang"), callback_data: "lang" }
        ],
        [
          { text: "📜 " + t(lang, "about"), callback_data: "intro" },
          { text: "❓ " + t(lang, "help"), callback_data: "help" }
        ]
      ]
    }
  };
}
