// src/i18n.js
const fs = require("fs");
const path = require("path");

const localesPath = path.join(__dirname, "locales");
const files = fs.readdirSync(localesPath);

const translations = {};

for (const file of files) {
  if (file.endsWith(".json")) {
    const lang = path.basename(file, ".json");
    translations[lang] = require(path.join(localesPath, file));
  }
}

function t(lang, key) {
  return translations[lang]?.[key] || key;
}

module.exports = { t };
