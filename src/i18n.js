// src/i18n.js
const vi = require("./locales/vi.json");
const en = require("./locales/en.json");

const locales = { vi, en };

/**
 * Trả về bản dịch theo key + ngôn ngữ
 * @param {string} lang - mã ngôn ngữ (vi|en)
 * @param {string} key - khóa cần dịch
 * @param {object} vars - biến để thay thế {var}
 */
function t(lang = "en", key, vars = {}) {
  const dict = locales[lang] || locales.en;
  let text = dict[key] || key;

  for (const [k, v] of Object.entries(vars)) {
    text = text.replace(new RegExp(`{${k}}`, "g"), v);
  }

  return text;
}

module.exports = { t };
