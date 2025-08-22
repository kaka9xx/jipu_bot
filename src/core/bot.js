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

function withUserLang(handler) {
  return async (payload) => {
    const chatId = payload.message?.chat?.id || payload.chat?.id;
    if (!chatId) return;

    // ✅ Cập nhật tên/username mới nhất
    if (payload.message) await updateUserFromMsg(payload.message);

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
  bot.setMyCommands([
    { command: "start", description: "Start the bot" },
    { command: "help", description: "Help info" },
    { command: "whoami", description: "Show your chatId" },
  ]);

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

  // Chỉ giữ "message" để handleCommand xử lý tất cả lệnh
  bot.on("message", withUserLang((msg, chatId, lang) => {
    handleCommand(bot, msg, lang);
  }));

  // Menu callback
  bot.on("callback_query", withUserLang((query, chatId, lang) => {
    handleMenu(bot, query, lang);
  }));

  // Document upload cho delete CSV
  bot.on("document", (msg) => handleCsvUpload(bot, msg));
}

module.exports = { setupBot, bot };
