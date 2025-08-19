const fs = require("fs");
const path = require("path");

// Đúng đường dẫn tới thư mục locales (ngang cấp với i18n.js trong src/)
const localesPath = path.join(__dirname, "locales");

// Đọc danh sách file JSON trong thư mục locales
const files = fs.readdirSync(localesPath);

const translations = {};

for (const file of files) {
  if (file.endsWith(".json")) {
    const lang = path.basename(file, ".json");
    translations[lang] = require(path.join(localesPath, file));
  }
}

// Hàm dịch
function t(lang, key) {
  return translations[lang]?.[key] || key;
}

module.exports = { t };
