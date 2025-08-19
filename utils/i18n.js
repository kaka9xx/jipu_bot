import fs from "fs";

const langFile = JSON.parse(fs.readFileSync("./lang.json", "utf8"));

export function t(lang, key, vars = {}) {
  const fallback = "en";
  let text =
    (langFile[lang] && langFile[lang][key]) ||
    (langFile[fallback] && langFile[fallback][key]) ||
    key;

  for (const [k, v] of Object.entries(vars)) {
    text = text.replaceAll(`{${k}}`, String(v));
  }
  return text;
}
