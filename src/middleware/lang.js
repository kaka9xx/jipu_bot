// src/middleware/lang.js
const { t } = require('../i18n');
const { getUserById } = require('../services/userService');

async function langMiddleware(msg, next) {
  try {
    const userId = msg.from?.id || msg.chat?.id;
    let locale = 'en';

    const user = await getUserById(userId);
    if (user && user.locale) {
      locale = user.locale;
    }

    msg.t = (key) => t(locale, key);
    await next();
  } catch (err) {
    console.error('Lang middleware error:', err);
    await next();
  }
}

module.exports = langMiddleware;
