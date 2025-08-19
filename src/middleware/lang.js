// src/middleware/lang.js
const { getUserById } = require("../core/user");

function langMiddleware(req, res, next) {
  try {
    const chatId = req.body?.message?.chat?.id || req.body?.callback_query?.from?.id;
    if (chatId) {
      const user = getUserById(chatId);
      req.lang = user?.lang || "en";
    } else {
      req.lang = "en";
    }
  } catch (err) {
    console.error("Lang middleware error:", err);
    req.lang = "en";
  }
  next();
}

module.exports = langMiddleware;
