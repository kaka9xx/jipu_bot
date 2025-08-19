const { saveUser } = require('../services/userService');

module.exports = {
  name: 'start',
  async execute(msg) {
    const userId = msg.from?.id;

    // lưu user lần đầu
    await saveUser(userId, { locale: 'en' }); // mặc định English

    await msg.reply(msg.t('welcome_message'));
  },
};
