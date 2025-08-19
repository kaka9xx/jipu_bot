const { settingsLogic } = require("../features/settings");
module.exports = {
  command: "settings",
  description: "Open settings",
  execute: (bot, msg, lang) => settingsLogic(bot, msg.chat.id, lang)
};
