const { t } = require("../i18n");

/**
 * Hiển thị phần trợ giúp (help) cho user
 */
async function helpFeature(bot, msg, chatId, lang = "en") {
  try {
    // Lấy các key từ JSON
    const title = t(lang, "help.title");
    const usage = t(lang, "help.usage");

    // Các command con trong object help
    const commands = [
      `/start - ${t(lang, "help.start")}`,
      `/menu - ${t(lang, "help.menu")}`,
      `/farm - ${t(lang, "help.farm")}`,
      `/claim - ${t(lang, "help.claim")}`,
      `/shop - ${t(lang, "help.shop")}`,
      `/settings - ${t(lang, "help.settings")}`,
    ].join("\n");

    // Format message
    const helpText = `*${title}*\n\n${usage}\n\n${commands}`;

    await bot.sendMessage(chatId, helpText, { parse_mode: "Markdown" });
  } catch (err) {
    console.error("❌ Help error:", err.message);
    await bot.sendMessage(chatId, "⚠️ Error loading help.");
  }
}

module.exports = { helpFeature };
