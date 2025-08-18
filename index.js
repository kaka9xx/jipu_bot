import express from "express";
import { Telegraf } from "telegraf";
import { handleStart } from "./services/start.js";
import { handleLanguage, setLanguage } from "./services/lang.js";
import { getText } from "./utils/lang.js";
import { mainMenu } from "./services/menu.js";
import { findUser } from "./utils/db.js";

const app = express();

const BOT_TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 10000;

if (!BOT_TOKEN) {
  throw new Error("❌ Missing BOT_TOKEN in environment variables");
}

const bot = new Telegraf(BOT_TOKEN);

// --- Commands ---
bot.start((ctx) => handleStart(ctx));

// --- Menu buttons ---
bot.hears("🌾 Farm", (ctx) => {
  const user = findUser(ctx.from.id);
  const lang = user?.lang || "vi";
  ctx.reply(getText("farm", lang), {
    reply_markup: { keyboard: [[{ text: "⬅️ Về menu" }]], resize_keyboard: true }
  });
});

bot.hears("💰 Balance", (ctx) => {
  const user = findUser(ctx.from.id);
  const lang = user?.lang || "vi";
  ctx.reply(getText("balance", lang) + `: ${Math.floor(Math.random() * 1000)}💎`, {
    reply_markup: { keyboard: [[{ text: "⬅️ Về menu" }]], resize_keyboard: true }
  });
});

bot.hears("👥 Referral", (ctx) => {
  const user = findUser(ctx.from.id);
  const lang = user?.lang || "vi";
  const refLink = `https://t.me/${ctx.botInfo.username}?start=${user.id}`;
  ctx.reply(getText("referral", lang) + `\n${refLink}`, {
    reply_markup: { keyboard: [[{ text: "⬅️ Về menu" }]], resize_keyboard: true }
  });
});

bot.hears("❓ Help", (ctx) => {
  const user = findUser(ctx.from.id);
  const lang = user?.lang || "vi";
  ctx.reply(getText("help", lang), {
    reply_markup: { keyboard: [[{ text: "⬅️ Về menu" }]], resize_keyboard: true }
  });
});

bot.hears("🌐 Language", (ctx) => handleLanguage(ctx));

bot.hears("🇻🇳 Tiếng Việt", (ctx) => setLanguage(ctx, "vi"));
bot.hears("🇬🇧 English", (ctx) => setLanguage(ctx, "en"));

bot.hears("📜 About", (ctx) => {
  const user = findUser(ctx.from.id);
  const lang = user?.lang || "vi";
  ctx.reply(getText("about", lang), {
    reply_markup: { keyboard: [[{ text: "⬅️ Về menu" }]], resize_keyboard: true }
  });
});

// --- Back to main menu ---
bot.hears("⬅️ Về menu", (ctx) => {
  ctx.reply("🏠 Menu chính:", mainMenu());
});

// --- Express Webhook ---
app.use(await bot.createWebhook({ domain: process.env.RENDER_EXTERNAL_URL || `https://jipu-bot.onrender.com` }));

app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});
