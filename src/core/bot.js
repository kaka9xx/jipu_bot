const TelegramBot = require("node-telegram-bot-api");
const { langMiddleware } = require("../middleware/lang");
const { updateUser } = require("../services/userRepo");

function initBot() {
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

  // patch bot.use
  bot.use = function (mw) {
    const oldOn = this.on;
    this.on = (event, handler) => {
      oldOn.call(this, event, async (msg, ...args) => {
        // inject middleware
        await mw(msg, async () => {
          // middleware gắn msg.t vào đây
          handler(msg, ...args);
        });
      });
    };
  };

  // gắn middleware
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

  return bot;
}

module.exports = { initBot };
