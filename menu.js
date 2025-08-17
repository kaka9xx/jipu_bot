export function menuKeyboard(lang) {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🌱 Farm", callback_data: "menu_farm" },
          { text: "💰 Balance", callback_data: "menu_balance" },
          { text: "👥 Referral", callback_data: "menu_ref" },
          { text: "🌐 Lang", callback_data: "menu_lang" }
        ],
        [
          { text: "ℹ️ Info", callback_data: "menu_start" },
          { text: "📖 Help", callback_data: "menu_help" }
        ]
      ]
    }
  };
}