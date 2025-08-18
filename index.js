import TelegramBot from "node-telegram-bot-api";
import { getMainMenu } from "./services/menu.js";
import { handleFarm } from "./services/farm.js";
import { handleBalance } from "./services/balance.js";
import { handleReferral } from "./services/referral.js";
import { handleHelp } from "./services/help.js";
import { handleIntro } from "./services/intro.js";
import { handleLangMenu, handleLangSet } from "./services/lang.js";
import { t } from "./utils/lang.js";


// token bot Telegram
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// map user -> lang
const userLang = {};

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const lang = userLang[chatId] || "vi";

  const text = t(lang, "start");
  await bot.sendMessage(chatId, text, getMainMenu(t, lang));
});

// Xử lý callback từ nút
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  const lang = userLang[chatId] || "vi";

  switch (data) {
    case "farm":
      await handleFarm(bot, chatId, lang, t);
      break;
    case "balance":
      await handleBalance(bot, chatId, lang, t);
      break;
    case "ref":
      await handleReferral(bot, chatId, lang, t);
      break;
    case "help":
      await handleHelp(bot, chatId, lang, t);
      break;
    case "intro":
      await handleIntro(bot, chatId, lang, t);
      break;
    case "lang":
      await handleLangMenu(bot, chatId, lang, t);
      break;
    case "set_lang_vi":
      userLang[chatId] = "vi";
      await handleLangSet(bot, chatId, "vi", t);
      break;
    case "set_lang_en":
      userLang[chatId] = "en";
      await handleLangSet(bot, chatId, "en", t);
      break;
    case "back_menu":
      await bot.sendMessage(chatId, t(lang, "choose_next"), getMainMenu(t, lang));
      break;
      default:
      await bot.sendMessage(chatId, "❌ Unknown action.");
  }

  await bot.answerCallbackQuery(query.id);
});
