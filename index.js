import express from "express";
import TelegramBot from "node-telegram-bot-api";
import fs from "fs";
import langs from "./lang.json" assert { type: "json" };
import menu from "./menu.js";

// Import services
import { handleFarm } from "./services/farm.js";
import { handleReferral } from "./services/referral.js";
import { handleBalance } from "./services/balance.js";
import { handleHelp } from "./services/help.js";
import { handleLang } from "./services/lang.js";

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { webHook: true });
const app = express();

// Webhook setup (Render free)
const PORT = process.env.PORT || 10000;
const URL = process.env.RENDER_EXTERNAL_URL || `https://jipu-bot.onrender.com`;
bot.setWebHook(`${URL}/bot${token}`);

app.use(express.json());

// Webhook endpoint
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const lang = "vi";
  const t = langs[lang];

  bot.sendMessage(chatId, t.intro, {
    reply_markup: { inline_keyboard: menu(t) }
  });
});

// Handle menu buttons
bot.on("callback_query", (cb) => {
  const chatId = cb.message.chat.id;
  const lang = "vi"; // TODO: load từ database user
  const t = langs[lang];

  switch (cb.data) {
    case "farm":
      handleFarm(bot, chatId, t);
      break;
    case "balance":
      handleBalance(bot, chatId, t);
      break;
    case "referral":
      handleReferral(bot, chatId, t);
      break;
    case "help":
      handleHelp(bot, chatId, t);
      break;
    case "lang":
      handleLang(bot, chatId);
      break;
  }
  bot.answerCallbackQuery(cb.id);
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});
