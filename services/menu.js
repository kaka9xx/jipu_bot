export function getMainMenu(t, lang) {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "⚔️ Farm", callback_data: "farm" },
          { text: "💰 Balance", callback_data: "balance" },
        ],
        [
          { text: "👥 Referral", callback_data: "ref" },
          { text: "ℹ️ Help", callback_data: "help" },
        ],
        [
          { text: "🌐 Language", callback_data: "lang" },
          { text: "📜 About JIPU", callback_data: "intro" },
        ]
      ]
    }
  };
}
