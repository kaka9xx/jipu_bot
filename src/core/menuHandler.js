const { getUserById, addOrUpdateUser } = require("./user");

function handleMenu(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;
  let user = getUserById(chatId);

  if (!user) {
    user = { id: chatId, lang: "en", points: 0 };
    addOrUpdateUser(user);
  }

  switch (data) {
    case "farm":
      user.points = (user.points || 0) + 1;
      addOrUpdateUser(user);
      bot.answerCallbackQuery(query.id, { text: "🌾 Bạn vừa farm được 1 điểm!" });
      bot.sendMessage(chatId, `Điểm hiện tại: ${user.points}`);
      break;

    case "claim":
      const earned = user.points || 0;
      bot.answerCallbackQuery(query.id, { text: "💰 Bạn đã claim điểm!" });
      bot.sendMessage(chatId, `Bạn đã nhận ${earned} điểm và reset về 0.`);
      user.points = 0;
      addOrUpdateUser(user);
      break;

    case "shop":
      bot.answerCallbackQuery(query.id);
      bot.sendMessage(chatId, "🛒 Shop đang xây dựng...");
      break;

    case "settings":
      bot.answerCallbackQuery(query.id);
      bot.sendMessage(chatId, "⚙️ Settings đang cập nhật...");
      break;

    default:
      bot.answerCallbackQuery(query.id, { text: "❓ Chức năng chưa hỗ trợ" });
      break;
  }
}

module.exports = { handleMenu };
