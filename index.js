import TelegramBot from "node-telegram-bot-api";
import express from "express";
import dotenv from "dotenv";

import {
  getMainMenu,
  handleFarm,
  handleBalance,
  handleReferral,
  handleHelp,
  handleIntro,
  showLangMenu,
  handleLangSet
} from "./services/index.js";

import { t } from "./utils/i18n.js";

dotenv.config();

// --- State ngôn ngữ theo user (in-memory) ---
const userLang = new Map(); // userId -> "vi" | "en"
const getLang = (userId) => userLang.get(userId) || "vi";

// --- Khởi tạo bot ---
const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error("⚠️ Missing BOT_TOKEN in .env");
}

// Nếu có RENDER_EXTERNAL_URL -> webhook; ngược lại polling (dev local)
const USE_WEBHOOK = !!process.env.RENDER_EXTERNAL_URL;
const bot = new TelegramBot(token, { webHook: USE_WEBHOOK });

let BOT_USERNAME = "jipu_bot";
bot.getMe().then((me) => {
  BOT_USERNAME = me.username;
  console.log("🤖 Bot username:", BOT_USERNAME);
}).catch(() => {});

// --- Express cho webhook (Render) ---
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const URL = process.env.RENDER_EXTERNAL_URL;
const SECRET = process.env.SECRET_TOKEN;

app.get("/", (req, res) => res.send("✅ JIPU Bot is running"));

app.post(`/webhook/${token}`, (req, res) => {
  // Bảo vệ secret (nếu cấu hình)
  const incomingSecret = req.headers["x-telegram-bot-api-secret-token"];
  if (SECRET && incomingSecret !== SECRET) {
    console.log("🚨 Invalid secret token");
    return res.sendStatus(403);
  }
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.listen(PORT, async () => {
  console.log(`🌐 Server running on port ${PORT}`);

  if (USE_WEBHOOK) {
    if (!URL) {
      console.warn("⚠️ Missing RENDER_EXTERNAL_URL; webhook cannot be set.");
    } else {
      await bot.setWebHook(`${URL}/webhook/${token}`, {
        secret_token: SECRET
      });
      console.log("🔗 Webhook set:", `${URL}/webhook/${token}`);
    }
  } else {
    // Fallback polling nếu không dùng webhook
    console.log("📡 Starting bot in polling mode (dev/local)...");
    bot.startPolling();
  }
});

// ================== COMMANDS ==================

// /start <optional_ref>
bot.onText(/\/start(?:\s+(\S+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const refCode = match?.[1];

  // set mặc định VI nếu chưa có
  if (!userLang.has(userId)) userLang.set(userId, "vi");
  const lang = getLang(userId);

  // Lời chào + Menu chính
  await bot.sendMessage(chatId, `${t(lang, "start")}\n\n${t(lang, "choose_next")}`, getMainMenu(t, lang));
});

// /lang
bot.onText(/\/lang/, async (msg) => {
  await showLangMenu(bot, msg.chat.id, t);
});

// /help
bot.onText(/\/help/, async (msg) => {
  const lang = getLang(msg.from.id);
  await handleHelp(bot, msg.chat.id, t, lang);
  await bot.sendMessage(msg.chat.id, t(lang, "choose_next"), getMainMenu(t, lang));
});

// ================== CALLBACKS ==================
bot.on("callback_query", async (q) => {
  const chatId = q.message.chat.id;
  const userId = q.from.id;
  const lang = getLang(userId);

  try {
    switch (q.data) {
      case "farm":
        await handleFarm(bot, chatId, userId, t, lang);
        break;
      case "balance":
        await handleBalance(bot, chatId, userId, t, lang);
        break;
      case "ref":
        await handleReferral(bot, chatId, userId, t, lang, BOT_USERNAME);
        break;
      case "help":
        await handleHelp(bot, chatId, t, lang);
        break;
      case "intro":
        await handleIntro(bot, chatId, t, lang);
        break;
      case "lang":
        await showLangMenu(bot, chatId, t);
        break;
      case "back_menu":
        await bot.sendMessage(chatId, t(lang, "choose_next"), getMainMenu(t, lang));
        break;
      default:
        if (q.data.startsWith("set_lang:")) {
          const newLang = q.data.split(":")[1];
          userLang.set(userId, newLang);
          await handleLangSet(bot, chatId, newLang, t);
          // Gợi ý quay lại menu
          await bot.sendMessage(chatId, t(newLang, "choose_next"), getMainMenu(t, newLang));
        }
    }
  } finally {
    bot.answerCallbackQuery(q.id).catch(() => {});
  }
});
