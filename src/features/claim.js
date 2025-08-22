// src/features/claim.js
const { getUserById, addOrUpdateUser } = require('../core/user');
const { t } = require('../i18n');

async function claimLogic(bot, chatId, lang = 'en') {
  let user = await getUserById(chatId) || { id: chatId, lang: 'en', points: 0 };
  const earned = user.points || 0;
  user.points = 0;
  await addOrUpdateUser(user);

  const msg = t(lang, 'claim_done').replace('{{earned}}', String(earned));
  bot.sendMessage(chatId, msg);
}

module.exports = { claimLogic };
