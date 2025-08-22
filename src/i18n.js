// src/i18n.js
const fs = require("fs");
const path = require("path");

const localesPath = path.join(__dirname, "locales");
if (!fs.existsSync(localesPath)) {
  fs.mkdirSync(localesPath, { recursive: true });
}

const files = fs.readdirSync(localesPath);
const translations = {};

for (const file of files) {
  if (file.endsWith(".json")) {
    const lang = path.basename(file, ".json");
    try {
      translations[lang] = require(path.join(localesPath, file));
    } catch {
      translations[lang] = {};
    }
  }
}

// ==== CẬP NHẬT NHỎ NHẤT Thêm params====
function t(lang, key, params = {}) {
  const text = translations[lang]?.[key] || translations["en"]?.[key] || key;
  return text.replace(/\{(\w+)\}/g, (_, k) => params[k] || "");
}

module.exports = { t };
