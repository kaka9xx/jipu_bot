import fs from "fs";
const langs = JSON.parse(fs.readFileSync("./lang.json"));

export function getText(lang) {
  return langs[lang] || langs["en"];
}
