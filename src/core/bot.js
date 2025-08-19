const TelegramBot = require("node-telegram-bot-api");
const { t } = require("../i18n");
const { getUserById, saveUser } = require("../services/userService");

function initBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("⚠️ TELEGRAM_BOT_TOKEN chưa được cấu hình");

  const bot = new TelegramBot(token);

  // Helper: lấy locale của user
  function getLocale(userId) {
    const user = getUserById(userId);
    return user?.locale || "en";
  }

  // Helper: gửi tin nhắn với dịch tự động
  function sendT(chatId, key, params = {}) {
    const locale = getLocale(chatId);
    return bot.sendMessage(chatId, t(locale, key, params));
  }

  // ====== HANDLERS ======

  // /start
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    // lưu user nếu chưa có
    if (!getUserById(chatId)) {
      saveUser(chatId, { locale: "en" }); // mặc định English
    }

    await sendT(chatId, "start");
  });

  // /lang vi hoặc /lang en
  bot.onText(/\/lang (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const newLocale = match[1].toLowerCase();

    if (!["en", "vi"].includes(newLocale)) {
      return bot.sendMessage(chatId, "❌ Only 'en' or 'vi' supported");
    }

    saveUser(chatId, { locale: newLocale });

    await sendT(chatId, "lang_changed");
  });

  // fallback message
  bot.on("message", async (msg) => {
    if (msg.text && !msg.text.startsWith("/")) {
      await sendT(msg.chat.id, "unknown_command");
    }
  });

  return bot;
}

module.exports = { initBot };
