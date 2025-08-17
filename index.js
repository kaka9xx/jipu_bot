import TelegramBot from "node-telegram-bot-api";
import express from "express";
import fs from "fs";
import dotenv from "dotenv";

import { getMainMenu } from "./services/menu.js";
import { handleFarm } from "./services/farm.js";
import { handleBalance } from "./services/balance.js";
import { handleReferral } from "./services/referral.js";
import { handleHelp } from "./services/help.js";
import { handleLang, handleLangChoice } from "./services/lang.js";

dotenv.config();

// Load ngôn ngữ
const langs = JSON.parse(fs.readFileSync("./lang.json", "utf8"));
const t = (lang, key, vars = {}) => {
  let text = langs[lang]?.[key] || langs["vi"][key] || "";
  for (const [k, v] of Object.entries(vars)) {
    text = text.replace(`{${k}}`, v);
  }
  return text;
};

// DB
const DB_FILE = "./database/users.json";
const loadDB = () => (fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE)) : {});
const saveDB = (db) => fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });
const app = express();
app.use(express.json());

// Webhook
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "jipu_secret_" + Math.random().toString(36).slice(2);
const WEBHOOK_URL = `${process.env.RENDER_EXTERNAL_URL}/webhook/${WEBHOOK_SECRET}`;
await bot.setWebHook(WEBHOOK_URL);

// Xử lý webhook
app.post(`/webhook/${WEBHOOK_SECRET}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Webserver
const PORT = process.env.PORT || 10000;
app.get("/", (req, res) => res.send("✅ JIPU Bot Running..."));
app.listen(PORT, () => console.log(`🌐 Server running on ${PORT}`));

// Start
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

// Lang
bot.onText(/\/lang/, (msg) => handleLang(bot, msg, t));
bot.on("message", (msg) => handleLangChoice(bot, msg, t));

// Menu buttons
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const db = loadDB();
  const lang = db[userId + "_lang"] || "vi";

  const actions = {
    farm: () => handleFarm(bot, { chat: { id: chatId }, from: query.from }, t, lang),
    balance: () => handleBalance(bot, { chat: { id: chatId }, from: query.from }, t, lang),
    ref: () => handleReferral(bot, { chat: { id: chatId }, from: query.from }, t, lang),
    help: () => handleHelp(bot, { chat: { id: chatId }, from: query.from }, t, lang),
    intro: () => bot.sendMessage(chatId, t(lang, "about_text"), { reply_markup: { inline_keyboard: [[{ text: "⬅️ " + t(lang, "back_menu"), callback_data: "back_menu" }]] } }),
    lang: () => handleLang(bot, { chat: { id: chatId }, from: query.from }, t),
    back_menu: () => bot.sendMessage(chatId, t(lang, "choose_next"), getMainMenu(t, lang)),
  };

  if (actions[query.data]) actions[query.data]();
  bot.answerCallbackQuery(query.id).catch(() => {});
});
