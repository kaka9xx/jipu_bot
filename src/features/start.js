const { getUserById, addOrUpdateUser } = require("../core/user");
const { showMainMenu } = require("../utils/menu");
const { t } = require("../i18n");

async function startFeature(bot, msg, chatId) {
  let user = getUserById(chatId);
  const lang = user?.lang || "en";

  if (!user) {
    user = addOrUpdateUser({
      id: chatId,
      lang,
      username: msg.from?.username,
      first_name: msg.from?.first_name,
    });
  }

  // Intro text
  const intro = [
    "👋 " + t(lang, "about"), // thêm key i18n riêng cho dòng chào
    t(lang, "welcome"),
    t(lang, "about"),
    t(lang, "features"),
  ].join("\n\n");

  try {
    await bot.sendMessage(chatId, intro, { parse_mode: "Markdown" });
  } catch (err) {
    console.error("❌ Failed to send intro:", err.message);
  }

  // Gọi main menu, nhớ truyền lang
  showMainMenu(bot, chatId, lang);
}

module.exports = { startFeature };

