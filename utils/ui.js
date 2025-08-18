// utils/ui.js

// Cho các màn hình tĩnh (Help, Referral, Intro...)
export function backMenuKeyboard(lang, t) {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "⬅️ " + t(lang, "back_menu"), callback_data: "back_menu" }]
      ]
    }
  };
}

// Cho các màn hình động (Farm, Balance...)
export function actionKeyboard(type, lang, t) {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🔄 " + t(lang, "refresh"), callback_data: `refresh:${type}` }
        ],
        [
          { text: "⬅️ " + t(lang, "back_menu"), callback_data: "back_menu" }
        ]
      ]
    }
  };
}
