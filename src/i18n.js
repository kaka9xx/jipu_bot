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

function t(lang, key) {
  return translations[lang]?.[key] || key;
}

module.exports = { t };
