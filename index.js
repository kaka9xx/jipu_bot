import TelegramBot from 'node-telegram-bot-api';
import { farmCoins } from './services/farm.js';
import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

// --- i18n function ---
function t(lang, key, value) {
  const messages = {
    vi: {
      farm_success: `✅ Hoàn thành!\nBạn vừa farm được +${value} Jipu Energy ⚡\nTổng năng lượng hiện tại của bạn: {TOTAL}\n\nHẹn gặp lại sau 6 giờ nữa để farm tiếp.\n✨ JipuLand cảm ơn bạn vì sự đóng góp!`,
      start: `✨ Welcome to JipuLand ✨\nXa ngoài rìa vũ trụ Solana tồn tại một vương quốc bí ẩn mang tên JipuLand – quê hương của những sinh vật nhỏ màu mint, tròn trĩnh và tràn đầy năng lượng tích cực.\n\nNhưng nguồn năng lượng JIPU đang dần cạn kiệt…\nBạn đã được chọn để hỗ trợ hồi sinh vương quốc thông qua việc farm Jipu Energy mỗi ngày.\n\n🟢 Mỗi lần farm = thêm năng lượng cho JipuLand\n🟣 Năng lượng sẽ được quy đổi thành phần thưởng khi vương quốc hồi sinh\n\n👉 Hãy bắt đầu hành trình của bạn ngay bây giờ:\n/farm`,
      help:`📒 Hướng dẫn\n/farm – Farm Jipu Energy (1 lần mỗi 6h)\n/balance – Kiểm tra số Jipu Energy bạn đang sở hữu\n/ref – Nhận link mời bạn bè (mỗi người join = +10 Energy)\n/help – Hiển thị menu hướng dẫn\n\n🎯 Mục tiêu: Thu thập càng nhiều Energy càng tốt để nhận JIPU Token khi vương quốc hồi sinh.`
    },
    en: {
      farm_success: `✅ Done!\nYou farmed +${value} Jipu Energy ⚡\nYour current total: {TOTAL}\n\nCome back in 6 hours to farm again.\n✨ JipuLand thanks you for the contribution!`,
      start:`✨ Welcome to JipuLand ✨\nFar beyond the Solana universe lies the mysterious kingdom of JipuLand – home of small mint-colored creatures full of positive energy.\n\nThe JIPU energy is running low…\nYou have been chosen to help restore the kingdom by farming Jipu Energy every day.\n\n🟢 Each farm adds energy to JipuLand\n🟣 Energy will be converted into rewards when the kingdom is restored\n\n👉 Start your journey now:\n/farm`,
      help:`📒 Help\n/farm – Farm Jipu Energy (once every 6h)\n/balance – Check your Jipu Energy\n/ref – Get your referral link (+10 Energy per invite)\n/help – Show this help menu\n\n🎯 Goal: Collect as much Energy as possible to receive JIPU Tokens when the kingdom revives.`
    }
  };
  return messages[lang][key];
}

// --- Telegram Bot ---
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const db = JSON.parse(fs.readFileSync('./database/users.json'));
  const lang = db[msg.from.id + '_lang'] || 'vi';
  bot.sendMessage(msg.chat.id, t(lang,'start'));
});

bot.onText(/\/help/, (msg) => {
  const db = JSON.parse(fs.readFileSync('./database/users.json'));
  const lang = db[msg.from.id + '_lang'] || 'vi';
  bot.sendMessage(msg.chat.id, t(lang,'help'));
});

bot.onText(/\/farm/, async (msg) => {
  const result = await farmCoins(msg.from.id);
  const db = JSON.parse(fs.readFileSync('./database/users.json'));
  const lang = db[msg.from.id + '_lang'] || 'vi';
  let reply = t(lang, 'farm_success', result.earned).replace('{TOTAL}', result.total);
  bot.sendMessage(msg.chat.id, reply);
});

bot.onText(/\/balance/, (msg) => {
  const db = JSON.parse(fs.readFileSync('./database/users.json'));
  const total = db[msg.from.id] || 0;
  bot.sendMessage(msg.chat.id, `Bạn đang có ${total} Jipu Energy.`);
});

bot.onText(/\/ref/, (msg) => {
  const refLink = `https://t.me/your_bot_username?start=${msg.from.id}`;
  bot.sendMessage(msg.chat.id, `Link mời bạn bè của bạn: ${refLink} (mỗi lượt = +10 Energy)`);
});

bot.onText(/\/lang/, (msg) => {
  const opts = { reply_markup: { keyboard: [["🇻🇳 Tiếng Việt"],["🇺🇸 English"]], one_time_keyboard: true } };
  bot.sendMessage(msg.chat.id, 'Chọn ngôn ngữ / Choose language:', opts);
});

bot.on('message', (msg) => {
  const db = JSON.parse(fs.readFileSync('./database/users.json'));
  if (msg.text === '🇻🇳 Tiếng Việt') {
    db[msg.from.id + '_lang'] = 'vi';
    fs.writeFileSync('./database/users.json', JSON.stringify(db, null, 2));
    bot.sendMessage(msg.chat.id, 'Ngôn ngữ đã đặt thành Tiếng Việt.');
  } else if (msg.text === '🇺🇸 English') {
    db[msg.from.id + '_lang'] = 'en';
    fs.writeFileSync('./database/users.json', JSON.stringify(db, null, 2));
    bot.sendMessage(msg.chat.id, 'Language set to English.');
  }
});

// --- Express Web Server ---
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🤖 Jipu Bot is running with Web Server!');
});

// Example API: get balance by user id
app.get('/balance/:id', (req, res) => {
  const db = JSON.parse(fs.readFileSync('./database/users.json'));
  const total = db[req.params.id] || 0;
  res.json({ user: req.params.id, balance: total });
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running at http://localhost:${PORT}`);
});
