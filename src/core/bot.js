// src/core/bot.js
const TelegramBot = require("node-telegram-bot-api");
const { getUserById, addUser } = require("./user");
const { t } = require("../i18n");

const token = process.env.BOT_TOKEN;

// dùng webhook trên Render
const bot = new TelegramBot(token);

function setupBot(app) {
  // set webhook cho Render
  bot.setWebHook(`${process.env.RENDER_EXTERNAL_URL}/webhook/${token}`);

  // nhận tin nhắn
  bot.on("message", (msg) => {
    const chatId = msg.chat.id;

    // nếu user chưa tồn tại thì thêm mới
    if (!getUserById(chatId)) {
      addUser({ id: chatId, lang: "en" });
    }

    // trả lời user
    bot.sendMessage(chatId, t("en", "hello")); // key trong locales/en.json
  });

  // endpoint webhook
  app.post(`/webhook/${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });
}

module.exports = { setupBot };
