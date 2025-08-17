import TelegramBot from "node-telegram-bot-api";
import express from "express";
import fs from "fs";
import dotenv from "dotenv";
import crypto from "crypto";

import { getMainMenu } from "./services/menu.js";
import { handleFarm } from "./services/farm.js";
import { handleBalance } from "./services/balance.js";
import { handleReferral } from "./services/referral.js";
import { handleHelp } from "./services/help.js";
import { handleLang, handleLangChoice } from "./services/lang.js";

dotenv.config();

// 🔐 Lấy secret từ env, nếu không có thì fallback random (chỉ dành cho dev/test)
const WEBHOOK_SECRET =
  process.env.WEBHOOK_SECRET ||
  crypto.randomBytes(32).toString("hex");

// Load ngôn ngữ
const langFile = JSON.parse(fs.readFileSync("./lang.json", "utf8"));
function t(lang, key, vars = {}) {
  let text = langFile[lang]?.[key] || "";
  for (const [k, v] of Object.entries(vars)) {
    text = text.replace(`{${k}}`, v);
  }
  return text;
}

// DB người dùng
const userDBFile = "./database/users.json";
function loadDB() {
  if (!fs.existsSync(userDBFile)) return {};
  return JSON.parse(fs.readFileSync(userDBFile));
}
function saveDB(db) {
  fs.writeFileSync(userDBFile, JSON.stringify(db, null, 2));
}

// Khởi tạo bot ở chế độ webhook
const bot = new TelegramBot(process.env.BOT_TOKEN);
const app = express();
app.use(express.json());

// Webhook endpoint bảo mật
app.post(`/webhook/${WEBHOOK_SECRET}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Đăng ký webhook với Telegram
const webhookUrl = `${process.env.RENDER_EXTERNAL_URL}/webhook/${WEBHOOK_SECRET}`;
bot.setWebHook(webhookUrl);

app.get("/", (req, res) => res.send("✅ JIPU Bot is running"));
app.listen(process.env.PORT || 10000, () =>
  console.log(`🌐 Server running on ${process.env.PORT || 10000}`)
);

// /start command
bot.onText(/\/start/, (msg) => {
  const db = loadDB();
  const userId = msg.from.id;
  const lang = db[userId + "_lang"] || "vi";

  bot.sendMessage(msg.chat.id, t(lang, "start"), getMainMenu(t, lang));
});

// /lang command
bot.onText(/\/lang/, (msg) => {
  handleLang(bot, msg, t);
});

// Callback menu
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const db = loadDB();
  const lang = db[userId + "_lang"] || "vi";

  switch (query.data) {
    case "farm":
      handleFarm(bot, { chat: { id: chatId }, from: query.from }, t, lang);
      break;
    case "balance":
      handleBalance(bot, { chat: { id: chatId }, from: query.from }, t, lang);
      break;
    case "ref":
      handleReferral(bot, { chat: { id: chatId }, from: query.from }, t, lang);
      break;
    case "help":
      handleHelp(bot, { chat: { id: chatId }, from: query.from }, t, lang);
      break;
    case "intro":
      bot.sendMessage(
        chatId,
        t(lang, "about_text"),
        {
          reply_markup: {
            inline_keyboard: [[{ text: "⬅️ " + t(lang, "back_menu"), callback_data: "back_menu" }]]
          }
        }
      );
      break;
    case "lang":
      handleLang(bot, { chat: { id: chatId }, from: query.from }, t);
      break;
    case "back_menu":
      bot.sendMessage(chatId, t(lang, "choose_next"), getMainMenu(t, lang));
      break;
  }

  bot.answerCallbackQuery(query.id).catch(() => {});
});

// Xử lý chọn ngôn ngữ
bot.on("message", (msg) => {
  handleLangChoice(bot, msg, t);
});

console.log("🤖 Bot ready with secure webhook!");
