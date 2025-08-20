// src/core/bot.js
const TelegramBot = require("node-telegram-bot-api");
const { getUserById, addOrUpdateUser } = require("./user");
const { handleCommand } = require("./commandHandler");
const { showMainMenu, showReplyMenu } = require("../utils/menu");
const { handleMenu } = require("./menuHandler");

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

  // Handle /start
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const existing = getUserById(chatId);
    const lang = existing?.lang || "en";
    if (!existing) addOrUpdateUser({ id: chatId, lang });

    bot.sendMessage(chatId, "👋 Welcome to Farm Bot!");
    showMainMenu(bot, chatId);
  });

  // Handle /menu (hiện menu inline)
  bot.onText(/\/menu/, (msg) => {
    showMainMenu(bot, msg.chat.id);
  });

  // Handle /replymenu (bật reply menu)
  bot.onText(/\/replymenu/, (msg) => {
    showReplyMenu(bot, msg.chat.id);
  });

  // Handle message chung
  bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    if (msg.text.startsWith("/")) return; // tránh trùng với lệnh ở trên

    const existing = getUserById(chatId);
    const lang = existing?.lang || "en";
    if (!existing) addOrUpdateUser({ id: chatId, lang });

    handleCommand(bot, msg, lang);
  });

  // Handle callback query (inline keyboard)
  bot.on("callback_query", (query) => { try { return handleMenu(bot, query); } catch (e) { console.error(e); } });
}

module.exports = { setupBot };
