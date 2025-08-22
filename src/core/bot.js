// src/core/bot.js
const TelegramBot = require("node-telegram-bot-api");
const { startFeature } = require("../features/start");
const { helpFeature } = require("../features/help");

const { handleCommand } = require("./commandHandler");
const { handleMenu } = require("./menuHandler");
const { getUserById } = require("./user");
const { listUsersFeature } = require("../features/listUsers");
const {
  deleteUserFeature,
  whoAmIFeature,
  deleteUserCsvFeature,
  handleCsvUpload,
  exportUsersFeature
} = require("../features/deleteUser");


// Lấy token từ biến môi trường
const token = process.env.BOT_TOKEN;
if (!token) throw new Error("❌ Missing BOT_TOKEN");

// Lấy danh sách admin từ ENV (dạng: "123456789,987654321")
const ADMIN_IDS = (process.env.ADMIN_IDS || "").split(",").map((id) => id.trim());

// Tạo bot
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

  // ======================
  // 🔹 Đăng ký command list
  // ======================
  // Cho user thường
  bot.setMyCommands([
    { command: "start", description: "Start the bot" },
    { command: "help", description: "Help info" },
    { command: "whoami", description: "Show your chatId" },
  ]);

  // Cho admin
  ADMIN_IDS.forEach((adminId) => {
    if (!adminId) return;
    bot.setMyCommands(
      [
        { command: "start", description: "Start the bot" },
        { command: "help", description: "Help info" },
        { command: "whoami", description: "Show your chatId" },
        { command: "listusers", description: "List all users" },
        { command: "deleteuser", description: "Delete a user by ID" },
      ],
      { scope: { type: "chat", chat_id: adminId } }
    );
  });

  // ======================
  // 🔹 Register handlers
  // ======================

  // /start
  bot.onText(/\/start/, withUserLang((msg, chatId, lang) => {
    startFeature(bot, msg, chatId, lang);
  }));

  // /help
  bot.onText(/\/help/, withUserLang((msg, chatId, lang) => {
    helpFeature(bot, msg, chatId, lang);
  }));

  // /whoami → cho biết chatId của mình
  bot.onText(/\/whoami/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `👤 Your chatId is: <code>${chatId}</code>`, {
      parse_mode: "HTML",
    });
  });

  // /deleteuser → chỉ admin
  bot.onText(/\/deleteuser/, (msg) => {
    const chatId = msg.chat.id;
    deleteUserFeature(bot, msg, chatId);
  });
  //deleteuser CSV
  bot.onText(/\/deleteusercsv/, (msg) => deleteUserCsvFeature(bot, msg, msg.chat.id));
  bot.on("document", (msg) => handleCsvUpload(bot, msg));
  bot.onText(/\/exportusers/, (msg) => exportUsersFeature(bot, msg, msg.chat.id));


  // /listusers → chỉ admin
  bot.onText(/\/listusers/, (msg) => {
    const chatId = msg.chat.id;
    listUsersFeature(bot, msg, chatId);
  });

  // Tin nhắn thường
  bot.on("message", withUserLang((msg, chatId, lang) => {
    handleCommand(bot, msg, lang);
  }));

  // Menu callback
  bot.on("callback_query", withUserLang((query, chatId, lang) => {
    handleMenu(bot, query, lang);
  }));


}

module.exports = { setupBot };
