const { farmLogic } = require("../features/farm");
const { claimLogic } = require("../features/claim");
const { shopLogic } = require("../features/shop");
const { settingsLogic } = require("../features/settings");
const { profileFeature } = require("../features/profile");
const { helpFeature } = require("../features/help");

// import đúng các function mới AI
const { handleAskAI } = require("../ai/ask");
const { handleNPC } = require("../ai/npc");
const { aiMemeFeature } = require("../ai/meme");
const { handleReport } = require("../ai/antiCheat");

const { mainMenu, aiMenu, profileMenu } = require("../utils/menu");
const { t } = require("../i18n");

async function handleMenu(bot, query, lang="en") {
  const chatId = query.message.chat.id;
  const data = query.data;
  const userId = query.from.id; // dùng cho NPC/Anti-cheat

  try {
    switch (data) {
      case "main_menu":
        await bot.editMessageText(t(lang, "menu_main") || "📍 Main Menu:", {
          chat_id: chatId,
          message_id: query.message.message_id,
          ...mainMenu(lang)
        });
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

      case "settings":
        await settingsLogic(bot, chatId, lang);
        break;

      case "profile":
        await profileFeature(bot, query.message, chatId);
        await bot.sendMessage(chatId, t(lang, "profile_title") || "👤 Profile", profileMenu(lang));
        break;

      case "invite":
        await bot.sendMessage(chatId, (t(lang, "invite_text") || "🔗 Invite your friends with this link:") +
          ` https://t.me/jipu_farm_bot?start=${chatId}`);
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
        await bot.sendMessage(chatId, "❓ Hãy nhập câu hỏi bạn muốn hỏi Jipu AI:");
        // đợi 1 tin nhắn tiếp theo từ user
        bot.once("message", msg => handleAskAI(bot, chatId, msg.text));
        break;

      case "ai_npc":
        await handleNPC(bot, chatId, userId);
        break;

      case "ai_meme":
        await aiMemeFeature(bot, chatId);
        break;

      case "ai_report":
        await handleReport(bot, chatId, userId);
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
