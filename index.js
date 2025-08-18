import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

import { mainMenu } from "./utils/menu.js";
import { getText } from "./utils/lang.js";
import { findUser, addUser, updateUser } from "./utils/db.js";

const app = express();
app.use(bodyParser.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const BASE_URL = process.env.BASE_URL;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// gửi tin nhắn Telegram
async function sendMessage(chat_id, text, keyboard = null) {
  const payload = {
    chat_id,
    text,
    reply_markup: keyboard ? { keyboard, resize_keyboard: true } : undefined,
  };
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// webhook endpoint
app.post(`/webhook/${BOT_TOKEN}`, async (req, res) => {
  const msg = req.body.message;
  if (!msg) return res.sendStatus(200);

  const chatId = msg.chat.id;
  const text = msg.text;
  const { id, first_name, username } = msg.from;

  let user = findUser(id);
  if (!user) {
    user = addUser({
      user_id: id,
      first_name,
      username,
      lang: "vi",
      balance: 0,
      referral_code: `REF${id}`,
      created_at: new Date().toISOString(),
    });
  }

  const lang = getText(user.lang);

  if (text === "/start") {
    await sendMessage(chatId, lang.start, mainMenu(lang));
  } else if (text === "⬅️") {
    await sendMessage(chatId, lang.start, mainMenu(lang));
  } else if (text === "🌾 Farm") {
    const reward = Math.floor(Math.random() * 10) + 1;
    updateUser(id, { balance: user.balance + reward });
    await sendMessage(chatId, `${lang.farm} +${reward} 💰`, [[{ text: "⬅️" }]]);
  } else if (text === "💰 Balance") {
    await sendMessage(chatId, `${lang.balance}: ${user.balance} 💰`, [[{ text: "⬅️" }]]);
  } else if (text === "👥 Referral") {
    const refLink = `https://t.me/${process.env.BOT_USERNAME}?start=${user.referral_code}`;
    await sendMessage(chatId, `${lang.referral}: ${refLink}`, [[{ text: "⬅️" }]]);
  } else if (text === "❓ Help") {
    await sendMessage(chatId, lang.help, [[{ text: "⬅️" }]]);
  } else if (text === "📜 About") {
    await sendMessage(chatId, lang.about, [[{ text: "⬅️" }]]);
  } else if (text === "🌐 Language") {
    await sendMessage(chatId, lang.lang_choose, [
      [{ text: "🇻🇳" }, { text: "🇬🇧" }],
      [{ text: "⬅️" }],
    ]);
  } else if (text === "🇻🇳") {
    updateUser(id, { lang: "vi" });
    await sendMessage(chatId, "✅ Đã đổi ngôn ngữ sang Tiếng Việt", mainMenu(getText("vi")));
  } else if (text === "🇬🇧") {
    updateUser(id, { lang: "en" });
    await sendMessage(chatId, "✅ Language changed to English", mainMenu(getText("en")));
  }

  res.sendStatus(200);
});

// health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// self-ping để tránh sleep
setInterval(() => {
  if (BASE_URL) {
    fetch(`${BASE_URL}/health`).then(() => console.log("🔄 Self-ping to prevent Render sleep"));
  }
}, 14 * 60 * 1000);

app.listen(10000, () => {
  console.log(`🌐 Server chạy cổng 10000`);
  console.log(`🔗 Webhook: ${BASE_URL}/webhook/${BOT_TOKEN}`);
});
