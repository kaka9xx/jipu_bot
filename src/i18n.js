const fs = require("fs");
const path = require("path");

// Load toàn bộ file JSON trong thư mục locales
const localesDir = path.join(__dirname, "../locales");
const translations = {};

fs.readdirSync(localesDir).forEach((file) => {
  if (file.endsWith(".json")) {
    const locale = path.basename(file, ".json"); // vd: en, vi
    const filePath = path.join(localesDir, file);
    translations[locale] = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }
});

/**
 * Hàm dịch
 * @param {string} locale - mã ngôn ngữ (vd: "en", "vi")
 * @param {string} key - khóa trong JSON
 * @param {object} params - tham số chèn vào chuỗi
 * @returns {string}
 */
function t(locale, key, params = {}) {
  const lang = translations[locale] || translations["en"];
  let text = lang[key] || key;

  // thay thế biến {name} trong chuỗi
  Object.keys(params).forEach((p) => {
    text = text.replace(new RegExp(`{${p}}`, "g"), params[p]);
  });

  return text;
}

module.exports = { t };
