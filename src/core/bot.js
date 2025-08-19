const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const { langMiddleware } = require("../middleware/lang");
const { updateUser } = require("../services/userRepo");

function initBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("❌ TELEGRAM_BOT_TOKEN is missing in .env");
  }

  let bot;

  // 👉 Check nếu chạy trên Render (có URL public)
  if (process.env.RENDER_EXTERNAL_URL) {
    console.log("🌐 Running in webhook mode (Render)");

    bot = new TelegramBot(token);
    const app = express();
    app.use(express.json());

    // route nhận update từ Telegram
    app.post(`/webhook/${token}`, (req, res) => {
      bot.processUpdate(req.body);
      res.sendStatus(200);
    });

    // set webhook đến URL của Render
    const url = `${process.env.RENDER_EXTERNAL_URL}/webhook/${token}`;
    bot.setWebHook(url);

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`🚀 Bot webhook server running on port ${port}`);
    });
  } else {
    console.log("🖥️ Running in polling mode (local dev)");
    bot = new TelegramBot(token, { polling: true });
  }

  // patch bot.use (middleware system)
  bot.use = function (mw) {
    const oldOn = this.on;
    this.on = (event, handler) => {
      oldOn.call(this, event, async (msg, ...args) => {
        await mw(msg, async () => handler(msg, ...args));
      });
    };
  };

  // attach middleware
  bot.use(async (msg, next) => {
    await langMiddleware(msg, next);
  });

  // 👉 Command: /start
  bot.onText(/\/start/, async (msg) => {
    bot.sendMessage(msg.chat.id, msg.t("start"));
  });

  // 👉 Command: /lang vi|en
  bot.onText(/\/lang (vi|en)/, async (msg, match) => {
    const lang = match[1];
    await updateUser(msg.chat.id, { lang });
    bot.sendMessage(msg.chat.id, msg.t("lang_set_ok"));
  });

  return bot;
}

module.exports = { initBot };
