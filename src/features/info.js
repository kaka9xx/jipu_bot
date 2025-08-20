const { saveUser } = require("../services/userService");

async function startFeature(bot, msg) {
  const userId = msg.from?.id;

  // Lưu user nếu chưa có (mặc định English)
  await saveUser(userId, { locale: msg.lang || "en" });

  // Ghép nội dung giới thiệu
  const text = [
    msg.t("welcome"),
    msg.t("about"),
    msg.t("features")
  ].join("\n\n");

  await msg.reply(text);
}

async function helpFeature(bot, msg) {
  const text = [
    "❓ " + msg.t("commands"),
            msg.t("features"),
            msg.t("about")
  ].join("\n\n");

  await msg.reply(text);
}

module.exports = { startFeature, helpFeature };
