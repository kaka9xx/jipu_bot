//utils/menu.js
const { t } = require("../i18n");

function mainMenu(lang = "en") {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: t(lang, "btn_farm") || "🌱 Farm", callback_data: "farm" },
          { text: t(lang, "btn_quest") || "🎯 Quest", callback_data: "quest" }
        ],
        [
          { text: t(lang, "btn_upgrade") || "⚡ Upgrade", callback_data: "upgrade" },
          { text: t(lang, "btn_profile") || "👤 Profile", callback_data: "profile" }
        ],
        [
          { text: t(lang, "btn_ai_zone") || "🤖 AI Zone", callback_data: "ai_zone" },
          { text: t(lang, "btn_shop") || "🏪 Shop", callback_data: "shop" }
        ],
        [
          { text: t(lang, "btn_invite") || "🔗 Invite", callback_data: "invite" },
          { text: t(lang, "btn_help") || "📖 Help", callback_data: "help" }
        ],
         [
          { text: t(lang, "btn_settings") || "⚙️ Settings", callback_data: "settings" },
        ],
      ]
    }
  };
}

function aiMenu(lang="en") {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: t(lang, "btn_ai_ask") || "💬 Ask Jipu AI", callback_data: "ai_ask" }],
        [{ text: t(lang, "btn_ai_npc") || "👾 NPC Quest", callback_data: "ai_npc" }],
        [{ text: t(lang, "btn_ai_meme") || "😂 Meme AI", callback_data: "ai_meme" }],
        [{ text: t(lang, "btn_ai_report") || "🛡️ Anti-Cheat Report", callback_data: "ai_report" }],
        [{ text: t(lang, "btn_back") || "⬅️ Back", callback_data: "main_menu" }]
      ]
    }
  };
}

function profileMenu(lang="en") {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: t(lang, "btn_withdraw") || "💰 Withdraw", callback_data: "withdraw" },
          { text: t(lang, "btn_invite") || "🔗 Invite", callback_data: "invite" }
        ],
        [
          { text: t(lang, "btn_back") || "⬅️ Back", callback_data: "main_menu" }
        ]
      ]
    }
  };
}

function showMainMenu(bot, chatId, lang="en") {
  bot.sendMessage(chatId, t(lang, "menu_main") || "📍 Main Menu:", mainMenu(lang));
}

module.exports = { mainMenu, aiMenu, profileMenu, showMainMenu };
