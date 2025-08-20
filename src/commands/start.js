const { createOrUpdateUser } = require('../services/userService');
const getTranslator = require('../utils/getTranslator');

module.exports = {
  name: 'start',
  async execute(bot, msg) {
    const chatId = msg.chat.id;
    const userId = msg.from?.id;

    // lấy lang từ Telegram
    const langCode = msg.from?.language_code?.startsWith("vi") ? "vi" : "en";

    // lưu user kèm lang
    await createOrUpdateUser({ id: userId, lang: langCode });

    // lấy translator
    const t = getTranslator(langCode);

    const text = [
      t('welcome'),
      "",
      t('about'),
      "",
      t('features'),
      "",
      t('commands'),
      "",
      t('links')
    ].join("\n");

    await bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
  },
};
