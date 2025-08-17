import TelegramBot from "node-telegram-bot-api";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fs from "fs";

import { getMainMenu } from "./services/menu.js";
import { handleFarm } from "./services/farm.js";
import { handleBalance } from "./services/balance.js";
import { handleReferral } from "./services/referral.js";
import { handleHelp } from "./services/help.js";
import { handleLang, handleLangChoice } from "./services/lang.js";

dotenv.config();

const TOKEN = process.env.BOT_TOKEN;
const URL = process.env.RENDER_EXTERNAL_URL || `https://your-app.onrender.com`;
const PORT = process.env.PORT || 10000;

// Load lang.json
const langFile = JSON.parse(fs.readFileSync("./lang.json", "utf8"));
function t(lang, key, vars = {}) {
  let text = langFile[lang]?.[key] || langFile["en"]?.[key] || "";
  for (const [k, v] of Object.entries(vars)) {
    text = text.replace(`{${k}}`, v);
  }
  return text;
}

// DB đọc/ghi lang
const dbFile = "./database/users.json";
function readDB() {
  try {
    return JSON.parse(fs.readFileSync(dbFile, "utf8"));
  } catch {
    return {};
  }
}

// Init bot
const bot = new TelegramBot(TOKEN, { polling: false });

// Express app
const app = express();
app.use(bodyParser.json());

// Webhook route
app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Start server
app.listen(PORT, async () => {
  console.log(`🌐 Server running on port ${PORT}`);
  try {
    await bot.setWebHook(`${URL}/bot${TOKEN}`);
    console.log("✅ Webhook set:", `${URL}/bot${TOKEN}`);
  } catch (err) {
    console.error("❌ Error setting webhook:", err.message);
  }
});

// Commands & callbacks
bot.onText(/\/start/, (msg) => {
  const db = readDB();
  const lang = db[msg.from.id + "_lang"] || "vi";
  bot.sendMessage(msg.chat.id, t(lang, "start"), getMainMenu(t, lang));
});

bot.on("callback_query", (query) => {
  const db = readDB();
  const lang = db[query.from.id + "_lang"] || "vi";
  const msg = query.message;

  switch (query.data) {
    case "farm":
      handleFarm(bot, msg, t, lang);
      break;
    case "balance":
      handleBalance(bot, msg, t, lang);
      break;
    case "ref":
      handleReferral(bot, msg, t, lang);
      break;
    case "help":
      handleHelp(bot, msg, t, lang);
      break;
    case "lang":
      handleLang(bot, msg, t, lang);
      break;
    case "set_lang_vi":
    case "set_lang_en":
      handleLangChoice(bot, query, t);
      break;
    case "intro":
      bot.sendMessage(msg.chat.id, t(lang, "start"), getMainMenu(t, lang));
      break;
    case "back_menu":
      bot.sendMessage(msg.chat.id, t(lang, "choose_next"), getMainMenu(t, lang));
      break;
    default:
      bot.answerCallbackQuery(query.id, { text: "⚠️ Unknown command" });
  }
});
