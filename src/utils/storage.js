// src/utils/storage.js
const fs = require("fs");
const path = require("path");

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function readJSON(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) {
      if (fallback !== undefined) {
        ensureDir(path.dirname(filePath));
        fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), "utf-8");
        return fallback;
      }
      return null;
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw || "null") ?? fallback;
  } catch (e) {
    console.error("readJSON error:", e);
    return fallback;
  }
}

function writeJSON(filePath, data) {
  try {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (e) {
    console.error("writeJSON error:", e);
    return false;
  }
}

module.exports = { readJSON, writeJSON };
