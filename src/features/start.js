// src/features/start.js
const { getUserById, addOrUpdateUser } = require("../core/user");
const { showMainMenu } = require("../utils/menu");
const { t } = require("../i18n");

async function startFeature(bot, msg, chatId) {
  // ✅ phải await vì getUserById là async
  let user = await getUserById(chatId);
  let lang = user?.lang || "en";

  if (!user) {
    // ✅ thêm await khi lưu user mới
    user = await addOrUpdateUser({
      id: chatId,
      lang,
      username: msg.from?.username,
      first_name: msg.from?.first_name,
    });
  }

  // Intro text (sử dụng i18n)
  const intro = [
    "👋 " + t(lang, "welcome"), // key: "welcome": "Welcome to JIPU bot!"
    t(lang, "about"),
    t(lang, "features"),
    t(lang, "links"),
  ].join("\n\n");

  try {
    await bot.sendMessage(chatId, intro, { parse_mode: "Markdown" });
  } catch (err) {
    console.error("❌ Failed to send intro:", err.message);
  }

  // ✅ Gọi main menu với ngôn ngữ đã lấy từ DB
  showMainMenu(bot, chatId, lang);
}

module.exports = { startFeature };
