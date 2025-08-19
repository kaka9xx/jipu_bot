import express from "express";
import TelegramBot from "node-telegram-bot-api";
import { handleFarm } from "./src/services/farm.js";
import { handleBalance } from "./src/services/balance.js";
import { handleReferral } from "./src/services/referral.js";
import { handleHelp } from "./src/services/help.js";
import { handleAbout } from "./src/services/about.js";
import { handleLanguage, handleLangSwitch } from "./src/services/language.js";
import { addUser, findUser } from "./src/utils/db.js";
import { getText } from "./src/utils/lang.js";

const TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 10000;

const bot = new TelegramBot(TOKEN, { polling: true });

function mainMenu(lang = "vi") {
  return {
    reply_markup: {
      keyboard: [
        [{ text: getText("farm", lang) }, { text: getText("balance", lang) }],
        [{ text: getText("referral", lang) }, { text: getText("help", lang) }],
        [{ text: getText("language", lang) }, { text: getText("about", lang) }]
      ],
      resize_keyboard: true
    }
  };
}

bot.onText(/\/start/, (msg) => {
  const { id, first_name, username } = msg.from;
  let user = findUser(id);

  if (!user) {
    user = addUser({
      user_id: id,
      first_name,
      username,
      balance: 0,
      lang: "vi",
      referral_code: `REF${id}`,
      created_at: new Date().toISOString()
    });
  }

  const text = getText("start", user.lang);
  bot.sendMessage(id, text, mainMenu(user.lang));
});

bot.on("message", (msg) => {
  const { id } = msg.chat;
  const user = findUser(id) || { lang: "vi" };
  const lang = user.lang;

  switch (msg.text) {
    case "🌾 Farm":
    case "🌾 Nông trại":
      handleFarm(bot, msg, user);
      break;
    case "💰 Balance":
    case "💰 Số dư":
      handleBalance(bot, msg, user);
      break;
    case "👥 Referral":
    case "👥 Giới thiệu":
      handleReferral(bot, msg, user);
      break;
    case "❓ Help":
    case "❓ Trợ giúp":
      handleHelp(bot, msg, lang);
      break;
    case "📜 About":
    case "📜 Giới thiệu":
      handleAbout(bot, msg, lang);
      break;
    case "🌐 Language":
    case "🌐 Ngôn ngữ":
      handleLanguage(bot, msg);
      break;
    case "🇻🇳 Tiếng Việt":
      handleLangSwitch(bot, msg, "vi");
      break;
    case "🇬🇧 English":
      handleLangSwitch(bot, msg, "en");
      break;
    default:
      break;
  }
});

const app = express();
app.get("/", (req, res) => {
  res.send("JIPU Bot v1.1.0 is running 🚀");
});
app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});