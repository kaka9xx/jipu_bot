// src/features/help.js
function helpFeature(bot, msg, chatId) {
  const text = `
🤖 *Hướng dẫn sử dụng bot:*

/start - Bắt đầu
/help - Xem hướng dẫn
/farm - Trồng cây
/claim - Nhận thưởng hằng ngày
/shop - Mua sắm trong shop
/settings - Cài đặt ngôn ngữ, tuỳ chọn
`;

  bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
}

module.exports = { helpFeature };
