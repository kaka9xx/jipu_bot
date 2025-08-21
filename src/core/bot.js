// src/core/bot.js
const TelegramBot = require("node-telegram-bot-api");
const { handleCommand } = require("./commandHandler");
const { handleMenu } = require("./menuHandler");

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("❌ Missing BOT_TOKEN");

const bot = new TelegramBot(token, { webHook: true });

function setupBot(app) {
  const baseUrl = process.env.RENDER_EXTERNAL_URL || "";
  const webhookPath = `/webhook/${token}`;
  const webhookUrl = `${baseUrl}${webhookPath}`;
  bot.setWebHook(webhookUrl);

  app.post(webhookPath, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });

  // 👉 chỉ đăng ký 1 lần, không vòng lặp
  bot.on("message", (msg) => handleCommand(bot, msg));
  bot.on("callback_query", (query) => handleMenu(bot, query));
}

module.exports = { setupBot };
