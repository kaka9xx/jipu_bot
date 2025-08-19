// src/middleware/lang.js
const { getUserById } = require("../core/user");

function langMiddleware(req, res, next) {
  const chatId = req.body?.message?.chat?.id;

  if (chatId) {
    const user = getUserById(chatId);
    req.lang = user?.lang || "en"; // default English
  } else {
    req.lang = "en";
  }

  next();
}

module.exports = langMiddleware;
