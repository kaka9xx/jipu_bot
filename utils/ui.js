// utils/ui.js

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

// Nút Refresh + Back cho các màn hình động.
// refreshCb dùng chính callback cũ (farm/balance) để khỏi sửa index.js
export function actionKeyboard(type, lang, t) {
  const refreshCb = type; // "farm" hoặc "balance"
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🔄 " + t(lang, "refresh"), callback_data: refreshCb }],
        [{ text: "⬅️ " + t(lang, "back_menu"), callback_data: "back_menu" }]
      ]
    }
  };
}
