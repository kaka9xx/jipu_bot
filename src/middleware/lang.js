// src/middleware/lang.js
const { getUserById, createUser } = require("../services/userRepo");
const { t } = require("../i18n");

/**
 * Middleware để inject hàm translate (ctx.t) theo user lang
 * @param {object} ctx - context Telegram (msg hoặc callback_query)
 * @param {function} next - hàm tiếp theo
 */
async function langMiddleware(ctx, next) {
  const chatId = ctx.chat?.id || ctx.from?.id;
  if (!chatId) return next();

  let user = await getUserById(chatId);
  if (!user) {
    // nếu user chưa có → tạo mới với lang mặc định = en
    user = await createUser({ id: chatId, lang: "en", balance: 0 });
  }

  // gắn translate vào ctx
  ctx.user = user;
  ctx.t = (key, vars = {}) => t(user.lang || "en", key, vars);

  return next();
}

module.exports = { langMiddleware };
