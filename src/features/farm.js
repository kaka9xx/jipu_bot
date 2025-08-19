const { getUserById, addOrUpdateUser } = require("../core/user");
const { t } = require("../i18n");

function farmLogic(bot, chatId, lang = "en") {
  let user = getUserById(chatId) || { id: chatId, lang, points: 0 };
  user.points = (user.points || 0) + 1;
  addOrUpdateUser(user);

  const msg = t(lang, "farm_gain").replace("{{points}}", String(user.points));
  bot.sendMessage(chatId, msg);
}

module.exports = { farmLogic };
