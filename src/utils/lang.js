// src/utils/lang.js
const texts = {
  vi: {
    start: "👋 Xin chào! Chào mừng bạn đến với Jipu bot.",
    farm: "Farm",
    balance: "Số dư",
    referral: "Giới thiệu bạn bè",
    help: "Hướng dẫn",
    about: "Thông tin",
    language: "Ngôn ngữ",
    back: "⬅️ Quay lại",
    lang_choose: "🌐 Chọn ngôn ngữ:",
  },
  en: {
    start: "👋 Hello! Welcome to Jipu bot.",
    farm: "Farm",
    balance: "Balance",
    referral: "Referral",
    help: "Help",
    about: "About",
    language: "Language",
    back: "⬅️ Back",
    lang_choose: "🌐 Choose a language:",
  },
};

export function getText(lang) {
  return texts[lang] || texts["en"];
}
