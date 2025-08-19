// src/utils/menu.js
const mainMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "🌾 Farm", callback_data: "farm" },
        { text: "💰 Claim", callback_data: "claim" },
      ],
      [
        { text: "🛒 Shop", callback_data: "shop" },
        { text: "⚙️ Settings", callback_data: "settings" },
      ],
    ],
  },
};

const replyMenu = {
  reply_markup: {
    keyboard: [
      ["🌾 Farm", "💰 Claim"],
      ["🛒 Shop", "⚙️ Settings"],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  },
};

function showMainMenu(bot, chatId) {
  bot.sendMessage(chatId, "📍 Main Menu:", mainMenu);
}

function showReplyMenu(bot, chatId) {
  bot.sendMessage(chatId, "📍 Reply Menu bật:", replyMenu);
}

module.exports = { showMainMenu, showReplyMenu };
