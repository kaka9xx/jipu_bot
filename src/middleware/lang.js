// src/middleware/lang.js
const { t } = require('../i18n');
const { getUserById } = require('../services/userService');

/**
 * Middleware i18n
 * Gắn hàm msg.t(key) để dùng trong command
 */
async function langMiddleware(msg, next) {
  try {
    // lấy userId từ msg (tùy bạn đang dùng telegram hay messenger)
    const userId = msg.from?.id || msg.chat?.id;

    // lấy locale từ DB (userService), nếu không có mặc định en
    let locale = 'en';
    const user = await getUserById(userId);
    if (user && user.locale) {
      locale = user.locale;
    }

    // gắn hàm dịch vào msg
    msg.t = (key) => t(locale, key);

    next();
  } catch (err) {
    console.error('Lang middleware error:', err);
    next();
  }
}

module.exports = langMiddleware;
