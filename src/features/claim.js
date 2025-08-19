const { getUserById, addOrUpdateUser } = require("../core/user");
const { t } = require("../i18n");

function claimLogic(bot, chatId, lang = "en") {
  let user = getUserById(chatId) || { id: chatId, lang, points: 0 };
  const earned = user.points || 0;
  user.points = 0;
  addOrUpdateUser(user);

  const msg = t(lang, "claim_done").replace("{{earned}}", String(earned));
  bot.sendMessage(chatId, msg);
}

module.exports = { claimLogic };
