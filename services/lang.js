import fs from 'fs';

export function handleLang(bot, msg, t) {
  const opts = { 
    reply_markup: { 
      keyboard: [["🇻🇳 Tiếng Việt"],["🇺🇸 English"]],
      one_time_keyboard: true 
    } 
  };
  bot.sendMessage(msg.chat.id, t('vi','lang_choose'), opts);
}

export function handleLangChoice(bot, msg, t) {
  const db = JSON.parse(fs.readFileSync('./database/users.json'));
  if (msg.text === '🇻🇳 Tiếng Việt') {
    db[msg.from.id + '_lang'] = 'vi';
    fs.writeFileSync('./database/users.json', JSON.stringify(db, null, 2));
    bot.sendMessage(msg.chat.id, t('vi','lang_vi'));
  } else if (msg.text === '🇺🇸 English') {
    db[msg.from.id + '_lang'] = 'en';
    fs.writeFileSync('./database/users.json', JSON.stringify(db, null, 2));
    bot.sendMessage(msg.chat.id, t('en','lang_en'));
  }
}
