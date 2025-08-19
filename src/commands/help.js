module.exports = {
  name: 'help',
  async execute(msg) {
    // dùng i18n
    await msg.reply(msg.t('help_message'));
  },
};
