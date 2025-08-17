import fs from "fs";

const userDBFile = "./database/users.json";
function loadDB() {
  if (!fs.existsSync(userDBFile)) return {};
  return JSON.parse(fs.readFileSync(userDBFile));
}
function saveDB(db) {
  fs.writeFileSync(userDBFile, JSON.stringify(db, null, 2));
}

// Gửi menu chọn ngôn ngữ
export function handleLang(bot, msg, t) {
  const langKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🇻🇳 Tiếng Việt", callback_data: "lang_vi" }],
        [{ text: "🇬🇧 English", callback_data: "lang_en" }]
      ]
    }
  };
  bot.sendMessage(msg.chat.id, "🌐 Chọn ngôn ngữ / Choose language:", langKeyboard);
}

// Xử lý khi user chọn ngôn ngữ
export function handleLangChoice(bot, msg, t) {
  if (!msg.data) return;

  const db = loadDB();
  const userId = msg.from.id;

  if (msg.data === "lang_vi") {
    db[userId + "_lang"] = "vi";
    saveDB(db);
    bot.sendMessage(msg.message.chat.id, "✅ Đã đổi sang Tiếng Việt!");
  }

  if (msg.data === "lang_en") {
    db[userId + "_lang"] = "en";
    saveDB(db);
    bot.sendMessage(msg.message.chat.id, "✅ Language switched to English!");
  }
}
