// src/core/menuHandler.js
const { t } = require("../i18n");
const { farmLogic } = require("../features/farm");
const { claimLogic } = require("../features/claim");
const { shopLogic, shopShowItem, shopBuyDemo } = require("../features/shop");
const {
  settingsLogic,
  settingsShowLanguage,
  settingsSetLanguage,
  settingsToggleReplyMenu
} = require("../features/settings");
const { showMainMenu } = require("../utils/menu");

/**
 * Xử lý callback menu
 * @param {TelegramBot} bot
 * @param {object} query
 * @param {string} lang - ngôn ngữ user
 */
async function handleMenu(bot, query, lang) {
  const chatId = query.message.chat.id;
  const data = query.data || "";

  try {
    // Xử lý shop item
    if (data.startsWith("shop_item_")) {
      const itemId = data.replace("shop_item_", "");
      await shopShowItem(bot, chatId, lang, itemId);
      return bot.answerCallbackQuery(query.id);
    }

    // Xử lý shop buy
    if (data.startsWith("shop_buy_")) {
      const itemId = data.replace("shop_buy_", "");
      await shopBuyDemo(bot, chatId, lang, itemId);
      return bot.answerCallbackQuery(query.id, { text: "🧾 Purchased (demo)" });
    }

    // Switch xử lý các menu khác
    switch (data) {
      case "farm":
        await farmLogic(bot, chatId, lang);
        break;

      case "claim":
        await claimLogic(bot, chatId, lang);
        break;

      case "help":
        await bot.sendMessage(chatId, t(lang, "help_message"));
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
        await bot.sendMessage(chatId, "❓ Unknown option");
    }

    await bot.answerCallbackQuery(query.id);
  } catch (err) {
    console.error("❌ handleMenu error:", err);
    await bot.answerCallbackQuery(query.id, { text: "⚠️ Error occurred" });
  }
}

module.exports = { handleMenu };
