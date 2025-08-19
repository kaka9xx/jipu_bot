// src/utils/menu.js

function mainMenu() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🌾 Farm", callback_data: "farm" }],
        [{ text: "🎁 Claim", callback_data: "claim" }],
        [{ text: "🛒 Shop", callback_data: "shop" }],
      ],
    },
  };
}

module.exports = {
  mainMenu,
};
