// src/core/bot.js
const TelegramBot = require("node-telegram-bot-api");
const { startFeature } = require("../features/start");
const { helpFeature } = require("../features/help");

const { handleCommand } = require("./commandHandler");
const { handleMenu } = require("./menuHandler");
const { getUserById } = require("./user");

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("❌ Missing BOT_TOKEN");

const bot = new TelegramBot(token, { webHook: true });

/**
 * Helper: luôn lấy user.lang từ DB rồi mới gọi handler
 */
function withUserLang(handler) {
  return async (payload) => {
    const chatId = payload.message?.chat?.id || payload.chat?.id;
    if (!chatId) return;

    const user = await getUserById(chatId);
    const lang = user?.lang || process.env.DEFAULT_LANG || "en";

    handler(payload, chatId, lang);
  };
}

function setupBot(app) {
  const baseUrl = process.env.RENDER_EXTERNAL_URL || "";
  const webhookPath = `/webhook/${token}`;
  const webhookUrl = `${baseUrl}${webhookPath}`;
  bot.setWebHook(webhookUrl);

  app.post(webhookPath, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });

  // ✅ Đăng ký các command
  bot.onText(/\/start/, withUserLang((msg, chatId, lang) => {
    startFeature(bot, msg, chatId, lang);
  }));

  bot.onText(/\/help/, withUserLang((msg, chatId, lang) => {
    helpFeature(bot, msg, chatId, lang);
  }));

  // ✅ Tin nhắn thường
  bot.on("message", withUserLang((msg, chatId, lang) => {
    handleCommand(bot, msg, lang);
  }));

  // ✅ Menu callback
  bot.on("callback_query", withUserLang((query, chatId, lang) => {
    handleMenu(bot, query, lang);
  }));
}

module.exports = { setupBot };
