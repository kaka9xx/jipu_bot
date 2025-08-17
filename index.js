import express from "express";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import fs from "fs";
import { menuKeyboard } from "./menu.js";
import { handleFarm } from "./services/farm.js";
import { handleReferral } from "./services/referral.js";
import { handleBalance } from "./services/balance.js";
import { handleHelp } from "./services/help.js";
import { handleLang, handleLangChoice } from "./services/lang.js";

dotenv.config();

// Load ngôn ngữ
const langs = JSON.parse(fs.readFileSync("./lang.json", "utf8"));
function t(lang, key, vars = {}) {
  let text = langs[lang][key] || "";
  for (const [k, v] of Object.entries(vars)) {
    text = text.replace(`{${k}}`, v);
  }
  return text;
}

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Xử lý lệnh /start
bot.onText(/\/start/, (msg) => {
  const lang = "vi";
  bot.sendMessage(msg.chat.id, t(lang, "start"), {
    reply_markup: menuKeyboard(lang),
  });
});

bot.onText(/\/help/, (msg) => handleHelp(bot, msg, t));
bot.onText(/\/farm/, (msg) => handleFarm(bot, msg, t));
bot.onText(/\/balance/, (msg) => handleBalance(bot, msg, t));
bot.onText(/\/ref/, (msg) => handleReferral(bot, msg, t));
bot.onText(/\/lang/, (msg) => handleLang(bot, msg, t));

// Catch language selection
bot.on("message", (msg) => handleLangChoice(bot, msg, t));

// Web server cho Render
const app = express();
const PORT = process.env.PORT || 10000;
app.get("/", (req, res) => res.send("Bot is running..."));
app.listen(PORT, () => console.log(`🌐 Web server running on port ${PORT}`));
