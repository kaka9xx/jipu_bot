const { getUserById, addOrUpdateUser } = require("../core/user");
const { showMainMenu } = require("../utils/menu");
const { t } = require("../i18n");

async function startFeature(bot, msg, chatId) {
  let user = getUserById(chatId);
  const lang = user?.lang || "en";
  if (!user) {
    user = addOrUpdateUser({ id: chatId, lang });
  }

  // Lấy nội dung intro từ locales
  const intro = t(lang, "start_intro");
  await bot.sendMessage(chatId, intro);

  // Hiện main menu
  showMainMenu(bot, chatId);
}

module.exports = { startFeature };
