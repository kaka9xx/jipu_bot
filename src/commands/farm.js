const { farmLogic } = require("../features/farm");
module.exports = {
  command: "farm",
  description: "Increase user points",
  execute: (bot, msg, lang) => farmLogic(bot, msg.chat.id, lang)
};
