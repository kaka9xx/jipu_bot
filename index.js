import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';

import { handleFarm } from './services/farm.js';
import { handleReferral } from './services/referral.js';
import { handleBalance } from './services/balance.js';
import { handleHelp } from './services/help.js';
import { handleLang, handleLangChoice } from './services/lang.js';

dotenv.config();

// --- Load lang.json ---
const langFile = JSON.parse(fs.readFileSync('./lang.json', 'utf8'));
function t(lang, key, vars = {}) {
  let text = langFile?.[lang]?.[key] || `[missing:${key}]`;
  for (const [k, v] of Object.entries(vars)) {
    text = text.replace(`{${k}}`, v);
  }
  return text;
}

// --- Express App ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- Telegram Bot ---
const bot = new TelegramBot(process.env.BOT_TOKEN);
const url = process.env.RENDER_EXTERNAL_URL || `https://your-app.onrender.com`;
bot.setWebHook(`${url}/bot${process.env.BOT_TOKEN}`);

app.post(`/bot${process.env.BOT_TOKEN}`, express.json(), (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// --- Helper: Main Menu ---
function sendMainMenu(bot, chatId, lang) {
  const intro = t(lang, 'start');
  bot.sendMessage(chatId, intro, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: "⚔️ Farm", callback_data: "farm" },
          { text: "💰 Balance", callback_data: "balance" },
          { text: "👥 Referral", callback_data: "ref" }
        ],
        [
          { text: "🌍 Language", callback_data: "lang" },
          { text: "ℹ️ Help", callback_data: "help" }
        ]
      ]
    }
  });
}

// --- Commands ---
bot.onText(/\/start/, (msg) => {
  const db = JSON.parse(fs.readFileSync('./database/users.json'));
  const lang = db[msg.from.id + '_lang'] || 'vi';
  sendMainMenu(bot, msg.chat.id, lang);
});

bot.onText(/\/help/, (msg) => handleHelp(bot, msg, t));
bot.onText(/\/farm/, (msg) => handleFarm(bot, msg, t));
bot.onText(/\/balance/, (msg) => handleBalance(bot, msg, t));
bot.onText(/\/ref/, (msg) => handleReferral(bot, msg, t));
bot.onText(/\/lang/, (msg) => handleLang(bot, msg, t));

bot.on('message', (msg) => handleLangChoice(bot, msg, t));

// --- Callback queries ---
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const db = JSON.parse(fs.readFileSync('./database/users.json'));
  const lang = db[userId + '_lang'] || 'vi';

  // trả lời callback NGAY để tránh lỗi "query too old"
  bot.answerCallbackQuery(query.id).catch(() => {});

  const fakeMsg = { chat: { id: chatId }, from: query.from };

  switch (query.data) {
    case 'farm': handleFarm(bot, fakeMsg, t); break;
    case 'balance': handleBalance(bot, fakeMsg, t); break;
    case 'ref': handleReferral(bot, fakeMsg, t); break;
    case 'lang': handleLang(bot, fakeMsg, t); break;
    case 'help': handleHelp(bot, fakeMsg, t); break;
    case 'back_menu': sendMainMenu(bot, chatId, lang); break;
  }
});

// --- Web routes ---
app.get('/', (req, res) => res.send('<h2>🤖 JIPU Bot is running</h2>'));

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});
