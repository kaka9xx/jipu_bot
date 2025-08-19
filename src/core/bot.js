// src/core/bot.js
const TelegramBot = require("node-telegram-bot-api");
const { getUserById, addOrUpdateUser } = require("./user");
const { handleCommand } = require("./commandHandler");

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error("Missing BOT_TOKEN in environment");
}

const bot = new TelegramBot(token, { webHook: true });

function setupBot(app) {
  const baseUrl = process.env.RENDER_EXTERNAL_URL || "";
  const webhookPath = `/webhook/${token}`;
  const webhookUrl = `${baseUrl}${webhookPath}`;

  bot.setWebHook(webhookUrl);
  console.log("🌐 Webhook set to:", webhookUrl);

  app.post(webhookPath, (req, res) => {
    try {
      bot.processUpdate(req.body);
      res.sendStatus(200);
    } catch (e) {
      console.error("processUpdate error:", e);
      res.sendStatus(500);
    }
  });

  bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const existing = getUserById(chatId);
    const lang = existing?.lang || "en";
    if (!existing) addOrUpdateUser({ id: chatId, lang });

    handleCommand(bot, msg, lang);
  });
}

module.exports = { setupBot };
