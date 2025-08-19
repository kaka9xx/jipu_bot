const { shopLogic } = require("../features/shop");
module.exports = {
  command: "shop",
  description: "Open shop",
  execute: (bot, msg, lang) => shopLogic(bot, msg.chat.id, lang)
};
