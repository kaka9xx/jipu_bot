import express from "express";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import fs from "fs";

import { getMainMenu } from "./services/menu.js";
import { handleFarm } from "./services/farm.js";
import { handleBalance } from "./services/balance.js";
import { handleReferral } from "./services/referral.js";
import { handleHelp } from "./services/help.js";
import { handleLang, handleLangChoice } from "./services/lang.js";
import { t } from "./utils/translator.js";
import { loadDB, saveDB } from "./utils/database.js";

dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN);
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;

// Webhook endpoint
app.post(`/webhook/${process.env.BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Check server
app.get("/", (req, res) => res.send("✅ JIPU Bot running"));
app.listen(PORT, () => {
  console.log(`🌐 Server running on ${PORT}`);
  bot.setWebHook(`${process.env.BASE_URL}/webhook/${process.env.BOT_TOKEN}`);
  console.log("🤖 Bot ready with secure webhook!");
});

// ====== COMMANDS ======
bot.onText(/\/start/, (msg) => {
  const db = loadDB();
  const userId = msg.from.id;
  const lang = db[userId + "_lang"] || "vi";

  bot.sendMessage(
    msg.chat.id,
    t(lang, "start"),
    getMainMenu(t, lang)
  );
});

bot.onText(/\/lang/, (msg) => {
  handleLang(bot, msg, t);
});

// ====== CALLBACK QUERY ======
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
      bot.sendMessage(chatId, t(lang, "about_text"), {
        reply_markup: {
          inline_keyboard: [[{ text: "⬅️ " + t(lang, "back_menu"), callback_data: "back_menu" }]],
        },
      });
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

// ====== MESSAGE (LANG CHOICE) ======
bot.on("message", (msg) => {
  handleLangChoice(bot, msg, t);
});
