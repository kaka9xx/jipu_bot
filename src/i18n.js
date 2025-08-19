// src/i18n.js
const path = require('path');

// Load tất cả file locales
const locales = {
  en: require(path.join(__dirname, 'locales/en.json')),
  vi: require(path.join(__dirname, 'locales/vi.json')),
};

/**
 * Hàm dịch
 * @param {string} locale - mã ngôn ngữ (en | vi)
 * @param {string} key - key cần dịch
 */
function t(locale, key) {
  const lang = locales[locale] || locales['en']; // fallback English
  return lang[key] || key;
}

module.exports = { t };
