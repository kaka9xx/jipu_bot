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
      } else {
        const tgLang =
          req.body?.message?.from?.language_code ||
          req.body?.callback_query?.from?.language_code;

        if (tgLang && SUPPORTED_LANGS.includes(tgLang)) {
          lang = tgLang;
        }
      }
    }

    req.userLang = lang;
  } catch (err) {
    console.error("Lang middleware error:", err.message);
    req.userLang = DEFAULT_LANG;
  }

  next();
}

module.exports = langMiddleware;
