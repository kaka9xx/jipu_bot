import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import dotenv from 'dotenv';

import { handleFarm } from './services/farm.js';
import { handleReferral } from './services/referral.js';
import { handleBalance } from './services/balance.js';
import { handleHelp } from './services/help.js';
import { handleLang, handleLangChoice } from './services/lang.js';
import { sendMainMenu } from './services/menu.js';

dotenv.config();

const TOKEN = process.env.BOT_TOKEN;
const WEB_URL = process.env.WEB_URL; // VD: https://jipu-bot.onrender.com
const PORT = process.env.PORT || 10000;

// load ngôn ngữ
const langFile = JSON.parse(fs.readFileSync('./lang.json','utf8'));
function t(lang, key, vars = {}) {
  let text = langFile[lang]?.[key] || '';
  for (const [k,v] of Object.entries(vars)) {
    text = text.replace(`{${k}}`, v);
  }
  return text;
}

// Bot webhook
const bot = new TelegramBot(TOKEN, { webHook: true });
bot.setWebHook(`${WEB_URL}/bot${TOKEN}`);

const app = express();
app.use(express.json());

// endpoint webhook
app.post(`/bot${TOKEN}`, (req,res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// command /start
bot.onText(/\/start/, (msg) => {
  sendMainMenu(bot, msg.chat.id, t, msg.from.id);
});

// xử lý nút menu
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;

  if (query.data === "farm") handleFarm(bot, query.message, t);
  if (query.data === "balance") handleBalance(bot, query.message, t);
  if (query.data === "ref") handleReferral(bot, query.message, t);
  if (query.data === "help") handleHelp(bot, query.message, t);
  if (query.data === "lang") handleLang(bot, query.message, t);
  if (query.data.startsWith("set_lang")) handleLangChoice(bot, query, t);
  if (query.data === "back_menu") sendMainMenu(bot, chatId, t, userId);

  bot.answerCallbackQuery(query.id).catch(()=>{});
});

// chạy server web (Render cần)
app.get('/', (req,res) => res.send('🤖 JIPU Bot running...'));

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});
