// src/core/menuHandler.js
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
const { profileFeature } = require("../features/profile");

async function handleMenu(bot, query, lang) {
  const chatId = query.message.chat.id;
  const data = query.data || "";

  try {
    // 👉 Shop item detail
    if (data.startsWith("shop_item_")) {
      const itemId = data.replace("shop_item_", "");
      await shopShowItem(bot, chatId, lang, itemId);
      return bot.answerCallbackQuery(query.id);
    }

    // 👉 Shop buy demo
    if (data.startsWith("shop_buy_")) {
      const itemId = data.replace("shop_buy_", "");
      await shopBuyDemo(bot, chatId, lang, itemId);
      return bot.answerCallbackQuery(query.id, { text: "🧾 Purchased (demo)" });
    }

    // 👉 Các menu chính
    switch (data) {
      case "farm":
        await farmLogic(bot, chatId, lang);
        break;

      case "claim":
        await claimLogic(bot, chatId, lang);
        break;

      case "shop":
        await shopLogic(bot, chatId, lang);
        break;

      case "settings":
        await settingsLogic(bot, chatId, lang);
        break;

      case "profile":
        await profileFeature(bot, query.message, chatId); // ✅ dùng query.message để lấy profile
        break;

      case "help":
        await helpFeature(bot, query.message, chatId, lang); // dùng query.message để consistent
        break;

      // ⚙️ Settings: chọn ngôn ngữ
      case "settings_language":
        await settingsShowLanguage(bot, chatId, lang);
        break;

      case "set_lang_en":
        await settingsSetLanguage(bot, chatId, "en");
        break;

      case "set_lang_vi":
        await settingsSetLanguage(bot, chatId, "vi");
        break;

      // ⚙️ Settings: bật/tắt reply menu
      case "settings_reply_menu":
        await settingsToggleReplyMenu(bot, chatId);
        break;

      // 🔙 Quay lại menu chính
      case "back_to_menu":
        await showMainMenu(bot, chatId, lang);
        break;

      default:
        await bot.sendMessage(chatId, "❓ Unknown option");
    }

    // Trả lời callback query
    await bot.answerCallbackQuery(query.id);
  } catch (err) {
    console.error("❌ handleMenu error:", err);
    await bot.answerCallbackQuery(query.id, { text: "⚠️ Error occurred" });
  }
}

module.exports = { handleMenu };
