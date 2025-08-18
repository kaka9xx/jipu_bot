// utils/ui.js

// Menu chính
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
          { text: "📜 " + t(lang, "about_btn"), callback_data: "intro" }
        ],
        [
          { text: "🌐 " + t(lang, "lang_btn"), callback_data: "lang" }
        ]
      ]
    }
  };
}

// Nút quay về menu chính
export function backMenuKeyboard(lang, t) {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "⬅️ " + t(lang, "back_menu"), callback_data: "back_menu" }]
      ]
    }
  };
}

// Nút refresh + quay lại
export function refreshKeyboard(lang, t) {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🔄 " + t(lang, "refresh"), callback_data: "refresh" }],
        [{ text: "⬅️ " + t(lang, "back_menu"), callback_data: "back_menu" }]
      ]
    }
  };
}
