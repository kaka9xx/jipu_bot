import fs from "fs";

const langs = JSON.parse(fs.readFileSync("lang.json", "utf8"));

export function getText(key, lang = "vi") {
  return langs[lang][key] || langs["vi"][key] || key;
}