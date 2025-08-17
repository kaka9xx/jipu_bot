import TelegramBot from "node-telegram-bot-api";
import express from "express";
import dotenv from "dotenv";
import fs from "fs";

import { getMainMenu } from "./services/menu.js";
import { handleFarm } from "./services/farm.js";
import { handleBalance } from "./services/balance.js";
import { handleReferral } from "./services/referral.js";
import { handleHelp } from "./services/help.js";
import { showLangMenu, handleLangSet } from "./services/lang.js";

dotenv.config();

// Load langs
const langFile = JSON.parse(fs.readFileSync("./lang.json", "utf8"));
export function t(lang, key, vars = {}) {
  const fallbackLang = "vi";
  let text =
    (langFile[lang] && langFile[lang][key]) ||
    (langFile[fallbackLang] && langFile[fallbackLang][key]) ||
    key;
  for (const [k, v] of Object.entries(vars)) {
    text = text.replaceAll(`{${k}}`, String(v));
  }
  return text;
}

// Init bot in webhook mode
const bot = new TelegramBot(process.env.BOT_TOKEN, { webHook: true });

// Cache bot username for referral links
let BOT_USERNAME = "your_bot";
bot.getMe().then((me) => {
  BOT_USERNAME = me.username;
  console.log("🤖 Bot username:", BOT_USERNAME);
});

// Express server
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const URL = process.env.RENDER_EXTERNAL_URL;

// Webhook endpoint
app.post(`/webhook/${process.env.BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.get("/", (req, res) =>
  res.send("✅ JIPU Bot is running via webhook (Render Free)")
);

app.listen(PORT, async () => {
  console.log(`🌐 Web server running on port ${PORT}`);
  if (!URL) {
    console.warn(
      "⚠️ RENDER_EXTERNAL_URL is missing. Set it in environment for webhook."
    );
  } else {
    await bot.setWebHook(`${URL}/webhook/${process.env.BOT_TOKEN}`);
    console.log("🔗 Webhook set:", `${URL}/webhook/${process.env.BOT_TOKEN}`);
  }
});

// ───── Commands ─────
bot.onText(/\/start(?:\s+(\S+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Nếu có ref code trong /start <refId>, bạn có thể xử lý trong referral.js (optional)
  const refCode = match?.[1];

  // Gửi lời chào + menu
  const lang = await (await import("./utils/db.js")).getUserLang(userId);
  const intro = t(lang, "start");
  await bot.sendMessage(chatId, intro, getMainMenu(t, lang));
});

bot.onText(/\/lang/, async (msg) => {
  await showLangMenu(bot, msg.chat.id, t);
});

bot.onText(/\/help/, async (msg) => {
  const lang = await (await import("./utils/db.js")).getUserLang(msg.from.id);
  await handleHelp(bot, msg.chat.id, t, lang);
  await bot.sendMessage(msg.chat.id, t(lang, "choose_next"), getMainMenu(t, lang));
});

// ───── Callback (inline buttons) ─────
bot.on("callback_query", async (q) => {
  const chatId = q.message.chat.id;
  const userId = q.from.id;
  const db = await import("./utils/db.js");
  const lang = await db.getUserLang(userId);

  try {
    const data = q.data || "";
    if (data === "farm") {
      await handleFarm(bot, chatId, userId, t, lang);
      await bot.sendMessage(chatId, t(lang, "choose_next"), getMainMenu(t, lang));
    } else if (data === "balance") {
      await handleBalance(bot, chatId, userId, t, lang);
      await bot.sendMessage(chatId, t(lang, "choose_next"), getMainMenu(t, lang));
    } else if (data === "ref") {
      await handleReferral(bot, chatId, userId, t, lang, BOT_USERNAME);
      await bot.sendMessage(chatId, t(lang, "choose_next"), getMainMenu(t, lang));
    } else if (data === "help") {
      await handleHelp(bot, chatId, t, lang);
      await bot.sendMessage(chatId, t(lang, "choose_next"), getMainMenu(t, lang));
    } else if (data === "intro") {
      await bot.sendMessage(
        chatId,
        t(lang, "about_text"),
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "⬅️ " + t(lang, "back_menu"), callback_data: "back_menu" }]
            ]
          }
        }
      );
    } else if (data === "lang") {
      await showLangMenu(bot, chatId, t);
    } else if (data.startsWith("set_lang:")) {
      const newLang = data.split(":")[1];
      await handleLangSet(bot, chatId, userId, newLang, t);
      await bot.sendMessage(chatId, t(newLang, "choose_next"), getMainMenu(t, newLang));
    } else if (data === "back_menu") {
      await bot.sendMessage(chatId, t(lang, "choose_next"), getMainMenu(t, lang));
    }
  } finally {
    bot.answerCallbackQuery(q.id).catch(() => {});
  }
});
