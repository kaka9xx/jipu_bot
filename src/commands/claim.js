const { claimLogic } = require("../features/claim");
module.exports = {
  command: "claim",
  description: "Claim and reset points",
  execute: (bot, msg, lang) => claimLogic(bot, msg.chat.id, lang)
};

