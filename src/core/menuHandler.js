// src/core/menuHandler.js
// 👉 Xử lý các sự kiện nhấn nút menu (callback_query)

const { t } = require("../i18n");
const { farmLogic } = require("../features/farm");
const { claimLogic } = require("../features/claim");
const { shopLogic, shopShowItem, shopBuyDemo } = require("../features/shop");
const {
  settingsLogic,
  settingsShowLanguage,
  settingsSetLanguage,
  settingsToggleReplyMenu,
} = require("../features/settings");
const { showMainMenu } = require("../utils/menu");
const { helpFeature } = require("../features/help");

/**
 * Hàm xử lý callback từ inline menu
 * @param {TelegramBot} bot - instance bot
 * @param {Object} query - object callback_query từ Telegram
 * @param {String} lang - ngôn ngữ user, đã được gắn ở bot.js
 */
async function handleMenu(bot, query, lang = "en") {
  const chatId = query.message.chat.id;
  const data = query.data || "";

  // 👉 Các callback có dạng động (ví dụ: shop_item_123)
  if (data.startsWith("shop_item_")) {
    const itemId = data.replace("shop_item_", "");
    await shopShowItem(bot, chatId, lang, itemId);
    return bot.answerCallbackQuery(query.id);
  }

  if (data.startsWith("shop_buy_")) {
    const itemId = data.replace("shop_buy_", "");
    await shopBuyDemo(bot, chatId, lang, itemId);
    return bot.answerCallbackQuery(query.id, { text: "🧾 Purchased (demo)" });
  }

  // 👉 Các callback cố định
  switch (data) {
    case "farm":
      await farmLogic(bot, chatId, lang);
      break;

    case "claim":
      await claimLogic(bot, chatId, lang);
      break;

    case "help":
      await helpFeature(bot, query.message, chatId, lang);
      break;

    case "shop":
      await shopLogic(bot, chatId, lang);
      break;

    case "settings":
      await settingsLogic(bot, chatId, lang);
      break;

    case "settings_language":
      await settingsShowLanguage(bot, chatId, lang);
      break;

    case "set_lang_en":
      await settingsSetLanguage(bot, chatId, "en");
      break;

    case "set_lang_vi":
      await settingsSetLanguage(bot, chatId, "vi");
      break;

    case "settings_reply_menu":
      await settingsToggleReplyMenu(bot, chatId);
      break;

    case "back_to_menu":
      await showMainMenu(bot, chatId, lang);
      break;

    default:
      bot.sendMessage(chatId, "❓ Unknown option");
  }

  // Luôn trả lời callback để tránh Telegram báo lỗi "loading..."
  await bot.answerCallbackQuery(query.id);
}

module.exports = { handleMenu };
