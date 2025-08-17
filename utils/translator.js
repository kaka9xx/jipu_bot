import fs from "fs";
const langFile = JSON.parse(fs.readFileSync("./lang.json", "utf8"));

export function t(lang, key, vars = {}) {
  let text = langFile[lang]?.[key] || "";
  for (const [k, v] of Object.entries(vars)) {
    text = text.replace(`{${k}}`, v);
  }
  return text;
}
