const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const { langMiddleware } = require("../middleware/lang");
const { updateUser } = require("../services/userRepo");

function initBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const bot = new TelegramBot(token, { polling: false });
  const app = express();

  // middleware
  bot.use = function (mw) {
    const oldOn = this.on;
    this.on = (event, handler) => {
      oldOn.call(this, event, async (msg, ...args) => {
        await mw(msg, async () => {
          handler(msg, ...args);
        });
      });
    };
  };

  bot.use(async (msg, next) => {
    await langMiddleware(msg, next);
  });

  // /start
  bot.onText(/\/start/, async (msg) => {
    bot.sendMessage(msg.chat.id, msg.t("start"));
  });

  // /lang vi|en
  bot.onText(/\/lang (vi|en)/, async (msg, match) => {
    const lang = match[1];
    await updateUser(msg.chat.id, { lang });
    bot.sendMessage(msg.chat.id, msg.t("lang_set_ok"));
  });

  // webhook config
  const port = process.env.PORT || 10000;
  const url = process.env.RENDER_EXTERNAL_URL || `https://jipu-bot.onrender.com`;

  (async () => {
    try {
      // Xóa webhook cũ trước khi set mới
      await bot.deleteWebHook();
      console.log("🧹 Old webhook deleted");

      await bot.setWebHook(`${url}/bot${token}`);
      console.log(`🌐 Running in webhook mode (Render)`);
    } catch (err) {
      console.error("❌ Error setting webhook:", err.message);
    }
  })();

  // express endpoint
  app.use(express.json());
  app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });

  app.listen(port, () => {
    console.log(`🚀 Bot webhook server running on port ${port}`);
  });

  return bot;
}

module.exports = { initBot };
