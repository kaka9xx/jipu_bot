// src/middleware/lang.js
const { getUserById } = require("../core/user");

const SUPPORTED_LANGS = ["en", "vi"];
const DEFAULT_LANG = process.env.DEFAULT_LANG || "en";

async function langMiddleware(req, res, next) {
  try {
    const chatId =
      req.body?.message?.chat?.id ||
      req.body?.callback_query?.from?.id;

    let lang = DEFAULT_LANG;

    if (chatId) {
      const user = await getUserById(chatId);
      if (user?.lang && SUPPORTED_LANGS.includes(user.lang)) {
        lang = user.lang;
      }
    }

    req.lang = lang;
  } catch (err) {
    console.error("Lang middleware error:", err);
    req.lang = DEFAULT_LANG;
  }

  next();
}

module.exports = langMiddleware;
