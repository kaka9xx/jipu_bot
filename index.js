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

import { getUserLang } from "./utils/db.js";

dotenv.config();

// Load đa ngôn ngữ
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

// Bot ở chế độ webhook (Render)
const bot = new TelegramBot(process.env.BOT_TOKEN, { webHook: true });

// Cache username để làm referral link
let BOT_USERNAME = "jipu_bot";
bot.getMe().then((me) => {
  BOT_USERNAME = me.username;
  console.log("🤖 Bot username:", BOT_USERNAME);
});

// Express server
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const URL = process.env.RENDER_EXTERNAL_URL;
const SECRET = process.env.SECRET_TOKEN;

// Webhook endpoint (có check secret token từ Telegram)
app.post(`/webhook/${process.env.BOT_TOKEN}`, (req, res) => {
  const incomingSecret = req.headers["x-telegram-bot-api-secret-token"];

  if (SECRET && incomingSecret !== SECRET) {
    console.log("🚨 Invalid secret token attempt!");
    return res.sendStatus(403);
  }

  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.get("/", (req, res) =>
  res.send("✅ JIPU Bot is running via webhook (Render Secure)")
);

app.listen(PORT, async () => {
  console.log(`🌐 Server running on port ${PORT}`);
  if (!URL) {
    console.warn("⚠️ Missing RENDER_EXTERNAL_URL env var!");
  } else {
    await bot.setWebHook(`${URL}/webhook/${process.env.BOT_TOKEN}`, {
      secret_token: SECRET,
    });
    console.log("🔗 Webhook set with secret token:", `${URL}/webhook/${process.env.BOT_TOKEN}`);
  }
});


// ───── Commands ─────
bot.onText(/\/start(?:\s+(\S+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const refCode = match?.[1]; // /start <refId>

  const lang = await getUserLang(userId);
  const intro = t(lang, "start");
  await bot.sendMessage(chatId, intro, getMainMenu(t, lang));
});

bot.onText(/\/lang/, async (msg) => {
  await showLangMenu(bot, msg.chat.id, t);
});

bot.onText(/\/help/, async (msg) => {
  const lang = await getUserLang(msg.from.id);
  await handleHelp(bot, msg.chat.id, t, lang);
  await bot.sendMessage(msg.chat.id, t(lang, "choose_next"), getMainMenu(t, lang));
});

// ───── Callback query ─────
// trong switch (q.data):
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
    await bot.sendMessage(chatId, t(lang, "about_text"), backMenuKeyboard(lang, t));
    break;
  case "lang":
    await showLangMenu(bot, chatId, t);
    break;
  case "back_menu":
    await bot.sendMessage(chatId, t(lang, "choose_next"), getMainMenu(t, lang));
    break;
  default:
    // ✅ xử lý refresh
    if (q.data.startsWith("refresh:")) {
      const type = q.data.split(":")[1];
      if (type === "farm") {
        await handleFarm(bot, chatId, userId, t, lang);
      } else if (type === "balance") {
        await handleBalance(bot, chatId, userId, t, lang);
      }
    } else if (q.data.startsWith("set_lang:")) {
      const newLang = q.data.split(":")[1];
      await handleLangSet(bot, chatId, userId, newLang, t);
      await bot.sendMessage(chatId, t(newLang, "choose_next"), getMainMenu(t, newLang));
    }
}
