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

// --- Load language file ---
const langFile = JSON.parse(fs.readFileSync('./lang.json','utf8'));
function t(lang, key, vars = {}) {
  let text = langFile[lang][key] || '';
  for (const [k, v] of Object.entries(vars)) {
    text = text.replace(`{${k}}`, v);
  }
  return text;
}

// --- Express App ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- Telegram Bot (Webhook mode) ---
const bot = new TelegramBot(process.env.BOT_TOKEN);

// URL public mà Render cấp cho bạn (vd: https://your-service.onrender.com)
const url = process.env.RENDER_EXTERNAL_URL || `https://your-app.onrender.com`;

// Đăng ký webhook
bot.setWebHook(`${url}/bot${process.env.BOT_TOKEN}`);

// Route nhận update từ Telegram
app.post(`/bot${process.env.BOT_TOKEN}`, express.json(), (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// --- Commands ---
bot.onText(/\/start/, (msg) => {
  const db = JSON.parse(fs.readFileSync('./database/users.json'));
  const lang = db[msg.from.id + '_lang'] || 'vi';
  bot.sendMessage(msg.chat.id, t(lang, 'start'));
});

bot.onText(/\/help/, (msg) => handleHelp(bot, msg, t));
bot.onText(/\/farm/, (msg) => handleFarm(bot, msg, t));
bot.onText(/\/balance/, (msg) => handleBalance(bot, msg, t));
bot.onText(/\/ref/, (msg) => handleReferral(bot, msg, t));
bot.onText(/\/lang/, (msg) => handleLang(bot, msg, t));

// Catch language selection
bot.on('message', (msg) => handleLangChoice(bot, msg, t));

// --- Extra Web Routes ---
app.get('/', (req, res) => {
  res.send('<h2>🤖 JIPU Bot (Webhook mode) is running!</h2><p>Try /leaderboard</p>');
});

app.get('/balance/:id', (req, res) => {
  const db = JSON.parse(fs.readFileSync('./database/users.json'));
  const total = db[req.params.id] || 0;
  res.json({ user: req.params.id, balance: total });
});

app.get('/leaderboard', (req, res) => {
  const db = JSON.parse(fs.readFileSync('./database/users.json'));
  const users = Object.entries(db)
    .filter(([k]) => !k.endsWith('_lang'))
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  res.json(users);
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

bot.on('message', (msg) => {
  console.log('📩 Update từ Telegram:', msg);
  handleLangChoice(bot, msg, t);
});