//features/setting.js
const { t } = require("../i18n");
const { showMainMenu, showReplyMenu } = require("../utils/menu");
const { getUserById, addOrUpdateUser } = require("../core/user");

async function settingsLogic(bot, chatId, lang = "en") {
  const text = [
    "⚙️ " + t(lang, "settings_title"),
    t(lang, "settings_desc"),
    "",
    "• " + t(lang, "settings_language"),
    "• " + t(lang, "settings_reply_menu"),
  ].join("\n");

  await bot.sendMessage(chatId, text, {
    reply_markup: {
      inline_keyboard: [
        [{ text: t(lang, "btn_change_lang"), callback_data: "settings_language" }],
        [{ text: t(lang, "btn_toggle_reply_menu"), callback_data: "settings_reply_menu" }],
        [{ text: t(lang, "btn_back"), callback_data: "back_to_menu" }],
      ],
    },
  });
}

async function settingsShowLanguage(bot, chatId, lang = "en") {
  await bot.sendMessage(chatId, t(lang, "choose_language"), {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🇺🇸 English", callback_data: "set_lang_en" }],
        [{ text: "🇻🇳 Tiếng Việt", callback_data: "set_lang_vi" }],
        [{ text: t(lang, "btn_back"), callback_data: "settings_language" }],
      ],
    },
  });
}

async function settingsSetLanguage(bot, chatId, newLang) {
  let user = await getUserById(chatId);
  if (!user) user = { id: chatId };

  await addOrUpdateUser({ ...user, lang: newLang });

  await bot.sendMessage(chatId, t(newLang, "lang_updated"));
  await settingsLogic(bot, chatId, newLang);
}

async function settingsToggleReplyMenu(bot, chatId) {
  let user = await getUserById(chatId);
  if (!user) {
    user = { id: chatId, lang: "en", replyMenu: false };
  }

  const lang = user.lang || "en";
  const newState = !user.replyMenu;

  await addOrUpdateUser({ ...user, replyMenu: newState });

  if (newState) {
    // Bật reply menu
    await bot.sendMessage(chatId, t(lang, "reply_menu_on"));
    showReplyMenu(bot, chatId, lang);
  } else {
    // Tắt reply menu + remove keyboard
    await bot.sendMessage(chatId, t(lang, "reply_menu_off"), {
      reply_markup: { remove_keyboard: true }
    });
    showMainMenu(bot, chatId, lang);
  }
}


module.exports = {
  settingsLogic,
  settingsShowLanguage,
  settingsSetLanguage,
  settingsToggleReplyMenu,
};
