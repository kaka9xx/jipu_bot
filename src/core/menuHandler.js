// src/core/menuHandler.js
const { getUserById, addOrUpdateUser } = require('./user');
const { farmLogic } = require('../features/farm');
const { claimLogic } = require('../features/claim');
const { shopLogic, shopShowItem, shopBuyDemo } = require('../features/shop');
const { settingsLogic, settingsShowLanguage, settingsSetLanguage, settingsToggleReplyMenu } = require('../features/settings');
const { showMainMenu } = require('../utils/menu');

async function handleMenu(bot, query) {
  const chatId = query.message.chat.id;
  let user = await getUserById(chatId) || { id: chatId, lang: 'en', points: 0 };
  const lang = user.lang || 'en';
  const data = query.data || '';

  // Pattern handlers first
  if (data.startsWith('shop_item_')) {
    const itemId = data.replace('shop_item_', '');
    await shopShowItem(bot, chatId, lang, itemId);
    await bot.answerCallbackQuery(query.id);
    return;
  }
  if (data.startsWith('shop_buy_')) {
    const itemId = data.replace('shop_buy_', '');
    await shopBuyDemo(bot, chatId, lang, itemId);
    await bot.answerCallbackQuery(query.id, { text: '🧾 Purchased (demo)' });
    return;
  }

  switch (data) {
    case 'farm':
      await farmLogic(bot, chatId, lang);
      break;
    case 'claim':
      await claimLogic(bot, chatId, lang);
      break;
    case 'shop':
      await shopLogic(bot, chatId, lang);
      break;
    case 'settings':
      await settingsLogic(bot, chatId, lang);
      break;
    case 'settings_language':
      await settingsShowLanguage(bot, chatId, lang);
      break;
    case 'set_lang_en':
      await settingsSetLanguage(bot, chatId, 'en');
      break;
    case 'set_lang_vi':
      await settingsSetLanguage(bot, chatId, 'vi');
      break;
    case 'settings_reply_menu':
      await settingsToggleReplyMenu(bot, chatId);
      break;
    case 'back_to_menu':
      await showMainMenu(bot, chatId, lang);
      break;
    default:
      bot.sendMessage(chatId, '❓ Unknown option');
  }

  await bot.answerCallbackQuery(query.id);
}

module.exports = { handleMenu };
