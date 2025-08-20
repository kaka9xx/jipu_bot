const { t } = require("../i18n");
const { getUserById, addOrUpdateUser } = require('../core/user');
const { showMainMenu, replyMenu } = require("../utils/menu");

function settingsLogic(bot, chatId, lang = "en") {
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: t(lang, "btn_language"), callback_data: "settings_language" }],
        [{ text: t(lang, "btn_reply_menu"), callback_data: "settings_reply_menu" }],
        [{ text: t(lang, "btn_back"), callback_data: "back_to_menu" }]
      ]
    }
  };
  bot.sendMessage(chatId, t(lang, "settings_title"), keyboard);
}

function settingsShowLanguage(bot, chatId, lang = "en") {
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "English", callback_data: "set_lang_en" },
          { text: "Tiếng Việt", callback_data: "set_lang_vi" }
        ],
        [{ text: t(lang, "btn_back"), callback_data: "settings" }]
      ]
    }
  };
  bot.sendMessage(chatId, t(lang, "settings_choose_language"), keyboard);
}

async function settingsSetLanguage(bot, chatId, newLang) {
  const user = await getUserById(chatId) || { id: chatId, lang: 'en', points: 0 };
  user.lang = newLang;
  await addOrUpdateUser(user);  // nên thêm await vì có thể là async
  const msg = t(newLang, "settings_lang_updated").replace("{{lang}}", newLang.toUpperCase());
  bot.sendMessage(chatId, msg);
  showMainMenu(bot, chatId, newLang);
}

async function settingsToggleReplyMenu(bot, chatId) {
  const user = await getUserById(chatId) || { id: chatId, lang: 'en', points: 0 };
  user.replyMenu = !user.replyMenu;
  await addOrUpdateUser(user);
  const lang = user.lang || "en";

  if (user.replyMenu) {
    bot.sendMessage(chatId, t(lang, "reply_menu_enabled"), replyMenu(lang));
  } else {
    bot.sendMessage(chatId, t(lang, "reply_menu_disabled"), { reply_markup: { remove_keyboard: true } });
  }
}

module.exports = { settingsLogic, settingsShowLanguage, settingsSetLanguage, settingsToggleReplyMenu };
