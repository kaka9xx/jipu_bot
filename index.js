const TelegramBot = require('node-telegram-bot-api');
const menuHandler = require('./src/core/menuHandler');
const commandHandler = require('./src/core/commandHandler');

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("❌ BOT_TOKEN not found in environment variables");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/(\w+)/, async (msg, match) => {
  await commandHandler(bot, msg, match[1]);
});

bot.on('callback_query', async (query) => {
  await menuHandler(bot, query);
});

console.log("🤖 Jipu Farm Bot is running...");
