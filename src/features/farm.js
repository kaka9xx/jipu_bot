module.exports = async function farmFeature(bot, chatId) {
  await bot.sendMessage(chatId, "🌾 Farm Menu:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🌱 Claim", callback_data: "claim" }],
        [{ text: "⬅️ Quay lại", callback_data: "start" }]
      ]
    }
  });
};
