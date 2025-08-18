export function getMainMenu(t, lang) {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🌾 " + t(lang, "farm_btn"), callback_data: "farm" },
          { text: "💰 " + t(lang, "balance_btn"), callback_data: "balance" }
        ],
        [
          { text: "👥 " + t(lang, "referral_btn"), callback_data: "ref" },
          { text: "❓ " + t(lang, "help_btn"), callback_data: "help" }
        ],
        [
          { text: "🌐 " + t(lang, "lang_btn"), callback_data: "lang" },
          { text: "📜 " + t(lang, "about_btn"), callback_data: "intro" }
        ]
      ]
    }
  };
}
