const { getUserById } = require("./user");

const SUPPORTED_LANGS = ["en", "vi"];
const DEFAULT_LANG = process.env.DEFAULT_LANG || "en";

/**
 * Lấy ngôn ngữ của user
 * Ưu tiên: msg.userLang (middleware) -> DB -> DEFAULT_LANG
 */
async function getLang(chatId, msg = {}) {
  try {
    // Nếu middleware đã gắn sẵn userLang
    if (msg.userLang && SUPPORTED_LANGS.includes(msg.userLang)) {
      return msg.userLang;
    }

    // Nếu có trong DB
    const user = await getUserById(chatId);
    if (user?.lang && SUPPORTED_LANGS.includes(user.lang)) {
      return user.lang;
    }

    // fallback
    return DEFAULT_LANG;
  } catch (err) {
    console.error("❌ getLang error:", err.message);
    return DEFAULT_LANG;
  }
}

module.exports = { getLang };
