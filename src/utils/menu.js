const { t } = require("../i18n");

/**
 * Inline menu (dùng với callback_query)
 */
function mainMenu(lang = "en") {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: t(lang, "btn_farm"), callback_data: "farm" },
          { text: t(lang, "btn_claim"), callback_data: "claim" },
        ],
        [
          { text: t(lang, "btn_shop"), callback_data: "shop" },
          { text: t(lang, "btn_settings"), callback_data: "settings" },
        ],
        [
          { text: t(lang, "btn_help"), callback_data: "help" }, // ✅ Help inline
        ],
      ],
    },
  };
}

/**
 * Reply menu (bàn phím thường)
 */
function replyMenu(lang = "en") {
  return {
    reply_markup: {
      keyboard: [
        [t(lang, "btn_farm"), t(lang, "btn_claim")],
        [t(lang, "btn_shop"), t(lang, "btn_settings")],
        [t(lang, "btn_help")], // ✅ Help reply
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  };
}

/**
 * Gửi inline main menu
 */
function showMainMenu(bot, chatId, lang = "en") {
  bot.sendMessage(chatId, t(lang, "menu_main"), mainMenu(lang));
}

/**
 * Gửi reply menu
 */
function showReplyMenu(bot, chatId, lang = "en") {
  bot.sendMessage(chatId, t(lang, "reply_menu_on"), replyMenu(lang));
}

module.exports = { showMainMenu, showReplyMenu, mainMenu, replyMenu };
