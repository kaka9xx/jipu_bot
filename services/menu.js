// services/menu.js

export function getMainMenu(t, lang) {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "⚔️ " + t(lang, "menu_farm"), callback_data: "farm" },
          { text: "💰 " + t(lang, "menu_balance"), callback_data: "balance" }
        ],
        [
          { text: "👥 " + t(lang, "menu_ref"), callback_data: "ref" },
          { text: "ℹ️ " + t(lang, "menu_help"), callback_data: "help" }
        ],
        [
          { text: "🌐 " + t(lang, "menu_lang"), callback_data: "lang" },
          { text: "📜 " + t(lang, "menu_intro"), callback_data: "intro" }
        ]
      ]
    }
  };
}

export function backToMenuButton(t, lang) {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "⬅️ " + t(lang, "back_menu"), callback_data: "back_menu" }]
      ]
    }
  };
}
