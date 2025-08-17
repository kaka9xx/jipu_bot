import TelegramBot from "node-telegram-bot-api";
import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import { menuKeyboard } from "./menu.js";
import { handleFarm } from "./services/farm.js";
import { handleBalance } from "./services/balance.js";
import { handleReferral } from "./services/referral.js";
import { handleHelp } from "./services/help.js";
import langs from "./lang.json" assert { type: "json" };

const TOKEN = process.env.BOT_TOKEN;
const URL = process.env.RENDER_EXTERNAL_URL || "https://jipu-bot.onrender.com";
const PORT = process.env.PORT || 10000;

const bot = new TelegramBot(TOKEN, { webHook: true });
bot.setWebHook(`${URL}/bot${TOKEN}`);

const app = express();
app.use(bodyParser.json());
app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

function t(lang, key) {
  return langs[lang]?.[key] || langs["en"][key] || "⚠️ Missing text";
}

if (!fs.existsSync("./database")) fs.mkdirSync("./database");
if (!fs.existsSync("./database/users.json")) fs.writeFileSync("./database/users.json", "{}");

function getLang(userId) {
  let db = JSON.parse(fs.readFileSync("./database/users.json", "utf8"));
  return db[userId + "_lang"] || "vi";
}
function setLang(userId, lang) {
  let db = JSON.parse(fs.readFileSync("./database/users.json", "utf8"));
  db[userId + "_lang"] = lang;
  fs.writeFileSync("./database/users.json", JSON.stringify(db, null, 2));
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const lang = getLang(msg.from.id);
  bot.sendMessage(chatId, t(lang, "start"), { parse_mode: "Markdown", ...menuKeyboard(lang) });
});

bot.onText(/\/help/, (msg) => handleHelp(bot, msg, t, getLang(msg.from.id)));
bot.onText(/\/farm/, (msg) => handleFarm(bot, msg, t, getLang(msg.from.id)));
bot.onText(/\/balance/, (msg) => handleBalance(bot, msg, t, getLang(msg.from.id)));
bot.onText(/\/ref/, (msg) => handleReferral(bot, msg, t, getLang(msg.from.id)));

bot.onText(/\/lang/, (msg) => {
  const chatId = msg.chat.id;
  const lang = getLang(msg.from.id);
  bot.sendMessage(chatId, t(lang, "choose_lang"), {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🇻🇳 Tiếng Việt", callback_data: "set_lang_vi" }, { text: "🇬🇧 English", callback_data: "set_lang_en" }]
      ]
    }
  });
});

bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  let lang = getLang(userId);

  switch (query.data) {
    case "set_lang_vi":
      setLang(userId, "vi");
      bot.answerCallbackQuery(query.id, { text: "✅ Đã đổi sang Tiếng Việt" });
      return bot.sendMessage(chatId, t("vi", "lang_set"), menuKeyboard("vi"));

    case "set_lang_en":
      setLang(userId, "en");
      bot.answerCallbackQuery(query.id, { text: "✅ Changed to English" });
      return bot.sendMessage(chatId, t("en", "lang_set"), menuKeyboard("en"));

    case "menu_farm":
      return handleFarm(bot, query.message, t, lang);
    case "menu_balance":
      return handleBalance(bot, query.message, t, lang);
    case "menu_ref":
      return handleReferral(bot, query.message, t, lang);
    case "menu_help":
      return handleHelp(bot, query.message, t, lang);
    case "menu_start":
      return bot.sendMessage(chatId, t(lang, "start"), { parse_mode: "Markdown", ...menuKeyboard(lang) });
  }
});

app.listen(PORT, () => console.log(`🌐 Web server running on port ${PORT}`));