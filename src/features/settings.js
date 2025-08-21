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
        [{ text:  t(lang, "btn_back"), callback_data: "settings" }],
      ],
    },
  });
}

async function settingsSetLanguage(bot, chatId, newLang) {
  const user = await getUserById(chatId);
  await addOrUpdateUser({ ...user, lang: newLang });
  await bot.sendMessage(chatId, t(newLang, "lang_updated"));
  await settingsLogic(bot, chatId, newLang);
}

/**
 * Toggle Reply Menu ON/OFF
 */
async function settingsToggleReplyMenu(bot, chatId) {
  const user = await getUserById(chatId);
  const lang = user?.lang || "en";

  // Nếu user chưa có thì tạo mới
  if (!user) {
    await addOrUpdateUser({ id: chatId, lang });
  }

  // Kiểm tra trạng thái replyMenu
  const replyMode = user?.replyMenu || false;

  if (!replyMode) {
    // Bật reply menu
    await addOrUpdateUser({ ...user, replyMenu: true });
    await bot.sendMessage(chatId, t(lang, "reply_menu_on"));
    showReplyMenu(bot, chatId, lang);
  } else {
    // Tắt reply menu, quay về inline menu
    await addOrUpdateUser({ ...user, replyMenu: false });
    await bot.sendMessage(chatId, t(lang, "reply_menu_off"));
    showMainMenu(bot, chatId, lang);
  }
}

module.exports = {
  settingsLogic,
  settingsShowLanguage,
  settingsSetLanguage,
  settingsToggleReplyMenu,
};
