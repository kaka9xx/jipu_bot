//core/menuHandler.js
const { farmLogic } = require("../features/farm");
const { claimLogic } = require("../features/claim");
const { shopLogic } = require("../features/shop");
const { profileFeature } = require("../features/profile");
const { helpFeature } = require("../features/help");
const {
  settingsLogic,
  settingsShowLanguage,
  settingsSetLanguage,
  settingsToggleReplyMenu,
} = require("../features/settings");

const { aiAskFeature } = require("../ai/ask");
const { aiNpcFeature } = require("../ai/npc");
const { aiMemeFeature } = require("../ai/meme");
const { aiReportFeature } = require("../ai/antiCheat");

const { mainMenu, aiMenu, profileMenu, showMainMenu } = require("../utils/menu");
const { t } = require("../i18n");

async function handleMenu(bot, query, lang="en") {
  const chatId = query.message.chat.id;
  const data = query.data;

  try {
    switch (data) {
      case "main_menu": // 🔙 Quay lại menu chính
        await bot.editMessageText(t(lang, "menu_main") || "📍 Main Menu:", {
          chat_id: chatId,
          message_id: query.message.message_id,
          ...mainMenu(lang)
        });
        break;

         // 🔙 Quay lại menu chính
      case "back_to_menu":
        await showMainMenu(bot, chatId, lang);
        break;

      case "farm":
        await farmLogic(bot, chatId, lang);
        break;

      case "claim":
        await claimLogic(bot, chatId, lang);
        break;

      case "shop":
        await shopLogic(bot, chatId, lang);
        break;

// ⚙️ Settings: chọn ngôn ngữ
      case "settings":
        await settingsLogic(bot, chatId, lang);
        break;

      case "settings_language":
        await settingsShowLanguage(bot, chatId, lang);
        break;

      case "set_lang_en":
        await settingsSetLanguage(bot, chatId, "en");
        break;

      case "set_lang_vi":
        await settingsSetLanguage(bot, chatId, "vi");
        break;

 // ⚙️ Settings: bật/tắt reply menu
      case "settings_reply_menu":
        await settingsToggleReplyMenu(bot, chatId);
        break;


 // Profile
  case "profile":
  case "invite":
    try {
        if (query.data === "profile") {
            // Xử lý profile
            await profileFeature(bot, query.message, chatId);
            const text = t(lang, "profile_title") || "👤 Profile";
            await bot.editMessageText(text, {
                chat_id: chatId,
                message_id: query.message.message_id,
                ...profileMenu(lang) // menu profile
            });

        } else if (query.data === "invite") {
            // Xử lý invite
            const inviteText = (t(lang, "invite_text") || "🔗 Invite your friends with this link:") +
                ` https://t.me/jipu_farm_bot?start=${chatId}`;
            await bot.editMessageText(inviteText, {
                chat_id: chatId,
                message_id: query.message.message_id
                // invite không cần menu, nếu muốn có menu thêm profileMenu(lang)
            });
        }

        console.log(`[MENU] Processed ${query.data} for chatId: ${chatId}`);
    } catch (error) {
        console.error(`[MENU] Error processing ${query.data} for chatId ${chatId}:`, error);
        await bot.sendMessage(chatId, "⚠️ Đã có lỗi, vui lòng thử lại sau.");
    }
    break;


      case "help":
        await helpFeature(bot, query.message, chatId);
        break;

      // ---- AI Zone ----
      case "ai_zone":
        await bot.editMessageText(t(lang, "menu_ai_title") || "🤖 Jipu AI Zone", {
          chat_id: chatId,
          message_id: query.message.message_id,
          ...aiMenu(lang)
        });
        break;

      case "ai_ask":
        await aiAskFeature(bot, chatId, lang);
        break;

      case "ai_npc":
        await aiNpcFeature(bot, chatId, lang);
        break;

      case "ai_meme":
        await aiMemeFeature(bot, chatId, lang);
        break;

      case "ai_report":
        await aiReportFeature(bot, chatId, lang);
        break;

      // Optional placeholders
      case "withdraw":
        await bot.sendMessage(chatId, t(lang, "withdraw_coming") || "💰 Withdraw coming soon.");
        break;

      case "upgrade":
        await shopLogic(bot, chatId, lang);
        break;

      case "quest":
        await bot.sendMessage(chatId, t(lang, "quest_coming") || "🎯 Daily quests coming soon.");
        break;

      default:
        await bot.answerCallbackQuery(query.id, { text: "Unknown action" });
        break;
    }
  } catch (err) {
    console.error("❌ handleMenu error:", err);
    try { await bot.answerCallbackQuery(query.id, { text: "⚠️ Error occurred" }); } catch {}
  }
}

module.exports = { handleMenu };
