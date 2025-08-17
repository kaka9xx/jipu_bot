import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import dotenv from 'dotenv';
import { handleFarm } from './services/farm.js';
import { handleReferral } from './services/referral.js';
import { handleBalance } from './services/balance.js';
import { handleHelp } from './services/help.js';
import { handleLang, handleLangChoice } from './services/lang.js';

dotenv.config();

// Load lang.json
const langFile = JSON.parse(fs.readFileSync('./lang.json','utf8'));
function t(lang, key, vars = {}) {
  let text = langFile[lang][key] || '';
  for (const [k,v] of Object.entries(vars)) {
    text = text.replace(`{${k}}`, v);
  }
  return text;
}

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Commands
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
