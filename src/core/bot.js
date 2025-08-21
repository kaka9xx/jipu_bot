// src/core/bot.js
const TelegramBot = require("node-telegram-bot-api");
const { startFeature } = require("../features/start");
const { helpFeature } = require("../features/help");
const { handleCommand } = require("./commandHandler");
const { handleMenu } = require("./menuHandler");

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("Missing BOT_TOKEN");

const bot = new TelegramBot(token, { webHook: true });

function setupBot(app) {
  const baseUrl = process.env.RENDER_EXTERNAL_URL || "";
  const webhookPath = `/webhook/${token}`;
  const webhookUrl = `${baseUrl}${webhookPath}`;
  bot.setWebHook(webhookUrl);

  app.post(webhookPath, (req, res) => {
    const lang = req.userLang || "en"; // 👈 lấy từ middleware lang.js
    bot.processUpdate({ ...req.body, _lang: lang });
    res.sendStatus(200);
  });

  // 👉 Gọi sang features, kèm ngôn ngữ
  bot.onText(/\/start/, (msg) =>
    startFeature(bot, msg, msg.chat.id, msg._lang || "en")
  );

  bot.onText(/\/help/, (msg) =>
    helpFeature(bot, msg, msg.chat.id, msg._lang || "en")
  );

  bot.on("message", (msg) =>
    handleCommand(bot, msg, msg._lang || "en")
  );

  bot.on("callback_query", (query) =>
    handleMenu(bot, query, query._lang || "en")
  );
}

module.exports = { setupBot };
