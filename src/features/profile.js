//src/features/profile.js
const { getUserById } = require("../core/user");
const { t } = require("../i18n");

async function profileFeature(bot, msg, chatId) {
  let user = await getUserById(chatId);
  if (!user) {
    await bot.sendMessage(chatId, "⚠️ No profile found. Try /start first.");
    return;
  }

  const lang = user.lang || "en";

  // Hiển thị profile cơ bản
  const profileText = [
    `🧑 ${t(lang, "profile_name")}: ${user.first_name || user.username || "N/A"}`,
    `🌐 ${t(lang, "profile_lang")}: ${user.lang}`,
    `💰 ${t(lang, "profile_points")}: ${user.points || 0}`,
    `📅 ${t(lang, "profile_created")}: ${user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}`
  ].join("\n");

  try {
    await bot.sendMessage(chatId, profileText, { parse_mode: "Markdown" });
  } catch (err) {
    console.error("❌ Failed to send profile:", err.message);
  }
}

module.exports = { profileFeature };

