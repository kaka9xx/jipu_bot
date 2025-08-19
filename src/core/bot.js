const { handleCommand } = require('./commandHandler');
const { logger } = require('../utils/logger');

function initBot() {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  if (!BOT_TOKEN) {
    logger.error("BOT_TOKEN chưa được cấu hình trong .env");
    process.exit(1);
  }

  logger.info("Bot khởi động với token: " + BOT_TOKEN);
  handleCommand("start", { user: "tester" });
}

module.exports = { initBot };