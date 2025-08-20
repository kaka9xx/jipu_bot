const { helpFeature } = require("../features/info");

module.exports = {
  name: "help",
  async execute(bot, msg) {
    await helpFeature(bot, msg);
  },
};
