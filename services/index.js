// Gom toàn bộ service ở đây để import gọn trong index.js
import { t } from "../utils/i18n.js";

// Menu chính
export function getMainMenu(tFn, lang) {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: tFn(lang, "farm_btn"), callback_data: "farm" },
          { text: tFn(lang, "balance_btn"), callback_data: "balance" }
        ],
        [
          { text: tFn(lang, "referral_btn"), callback_data: "ref" },
          { text: tFn(lang, "help_btn"), callback_data: "help" }
        ],
        [
          { text: tFn(lang, "lang_btn"), callback_data: "lang" },
          { text: tFn(lang, "about_btn"), callback_data: "intro" }
        ]
      ]
    }
  };
}

// 🌾 Farm (mock)
export async function handleFarm(bot, chatId, userId, tFn, lang) {
  const gain = Math.floor(Math.random() * 10) + 1;
  const balance = Math.floor(Math.random() * 200) + gain;
  await bot.sendMessage(
    chatId,
    tFn(lang, "farm_ok", { gain, balance }),
    {
      reply_markup: {
        inline_keyboard: [[{ text: tFn(lang, "back_menu"), callback_data: "back_menu" }]]
      }
    }
  );
}

// 💰 Balance (mock)
export async function handleBalance(bot, chatId, userId, tFn, lang) {
  const balance = Math.floor(Math.random() * 500);
  await bot.sendMessage(
    chatId,
    tFn(lang, "balance_text", { balance }),
    {
      reply_markup: {
        inline_keyboard: [[{ text: tFn(lang, "back_menu"), callback_data: "back_menu" }]]
      }
    }
  );
}

// 👥 Referral
export async function handleReferral(bot, chatId, userId, tFn, lang, botUsername) {
  const link = `https://t.me/${botUsername}?start=${userId}`;
  await bot.sendMessage(
    chatId,
    tFn(lang, "referral_text", { link }),
    {
      reply_markup: {
        inline_keyboard: [[{ text: tFn(lang, "back_menu"), callback_data: "back_menu" }]]
      }
    }
  );
}

// ❓ Help
export async function handleHelp(bot, chatId, tFn, lang) {
  await bot.sendMessage(
    chatId,
    tFn(lang, "help_text"),
    {
      reply_markup: {
        inline_keyboard: [[{ text: tFn(lang, "back_menu"), callback_data: "back_menu" }]]
      }
    }
  );
}

// 📜 About
export async function handleIntro(bot, chatId, tFn, lang) {
  await bot.sendMessage(
    chatId,
    tFn(lang, "about_text"),
    {
      reply_markup: {
        inline_keyboard: [[{ text: tFn(lang, "back_menu"), callback_data: "back_menu" }]]
      }
    }
  );
}

// 🌐 Language menu
export async function showLangMenu(bot, chatId, tFn) {
  // Dùng ngôn ngữ hiện hành hay mặc định VI để hiển thị tiêu đề
  await bot.sendMessage(
    chatId,
    tFn("vi", "lang_choose"),
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🇻🇳 Tiếng Việt", callback_data: "set_lang:vi" }],
          [{ text: "🇬🇧 English", callback_data: "set_lang:en" }],
          [{ text: t("vi", "back_menu"), callback_data: "back_menu" }]
        ]
      }
    }
  );
}

// Xác nhận đổi ngôn ngữ
export async function handleLangSet(bot, chatId, newLang, tFn) {
  await bot.sendMessage(
    chatId,
    tFn(newLang, "lang_set_ok"),
    {
      reply_markup: {
        inline_keyboard: [[{ text: tFn(newLang, "back_menu"), callback_data: "back_menu" }]]
      }
    }
  );
}
