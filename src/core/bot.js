// src/core/bot.js
const TelegramBot = require("node-telegram-bot-api");
const { getUserById, addOrUpdateUser } = require("./user");
const { handleCommand } = require("./commandHandler");
const { mainMenu } = require("../utils/menu"); // import menu

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

  // Nhận tin nhắn thường
  bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const existing = getUserById(chatId);
    const lang = existing?.lang || "en";

    if (!existing) {
      addOrUpdateUser({ id: chatId, lang });
    }

    // Xử lý command riêng
    handleCommand(bot, msg, lang);

    // Khi user gõ /start -> hiện menu
    if (msg.text === "/start") {
      bot.sendMessage(chatId, "👋 Welcome! Chọn chức năng bên dưới:", mainMenu());
    }
  });

  // Nhận callback từ inline menu
  bot.on("callback_query", (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    switch (data) {
      case "farm":
        bot.sendMessage(chatId, "🌾 Đây là menu farm của bạn!");
        break;
      case "claim":
        bot.sendMessage(chatId, "🎁 Bạn đã claim thành công!");
        break;
      case "shop":
        bot.sendMessage(chatId, "🛒 Đây là cửa hàng, hãy chọn vật phẩm.");
        break;
      default:
        bot.sendMessage(chatId, "❓ Chức năng chưa hỗ trợ.");
    }

    bot.answerCallbackQuery(query.id);
  });
}

module.exports = { setupBot };
