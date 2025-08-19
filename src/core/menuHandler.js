// src/core/menuHandler.js
const { getUserById } = require("./user");
const { farmLogic } = require("../features/farm");
const { claimLogic } = require("../features/claim");
const { shopLogic, shopShowItem, shopBuyDemo } = require("../features/shop");
const { settingsLogic, settingsShowLanguage, settingsSetLanguage, settingsToggleReplyMenu } = require("../features/settings");
const { showMainMenu } = require("../utils/menu");

function handleMenu(bot, query) {
  const chatId = query.message.chat.id;
  const user = getUserById(chatId) || { id: chatId, lang: "en", points: 0 };
  const lang = user.lang || "en";
  const data = query.data || "";

  // Pattern handlers first
  if (data.startsWith("shop_item_")) {
    const itemId = data.replace("shop_item_", "");
    shopShowItem(bot, chatId, lang, itemId);
    bot.answerCallbackQuery(query.id);
    return;
  }
  if (data.startsWith("shop_buy_")) {
    const itemId = data.replace("shop_buy_", "");
    shopBuyDemo(bot, chatId, lang, itemId);
    bot.answerCallbackQuery(query.id, { text: "🧾 Purchased (demo)" });
    return;
  }

  switch (data) {
    case "farm":
      farmLogic(bot, chatId, lang);
      break;
    case "claim":
      claimLogic(bot, chatId, lang);
      break;
    case "shop":
      shopLogic(bot, chatId, lang);
      break;
    case "settings":
      settingsLogic(bot, chatId, lang);
      break;
    case "settings_language":
      settingsShowLanguage(bot, chatId, lang);
      break;
    case "set_lang_en":
      settingsSetLanguage(bot, chatId, "en");
      break;
    case "set_lang_vi":
      settingsSetLanguage(bot, chatId, "vi");
      break;
    case "settings_reply_menu":
      settingsToggleReplyMenu(bot, chatId);
      break;
    case "back_to_menu":
      showMainMenu(bot, chatId, lang);
      break;
    default:
      bot.sendMessage(chatId, "❓ Unknown option");
  }

  bot.answerCallbackQuery(query.id);
}

module.exports = { handleMenu };
