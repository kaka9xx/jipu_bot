const { startFeature } = require("../features/info");

module.exports = {
  name: "start",
  async execute(bot, msg) {
    await startFeature(bot, msg);
  },
};
