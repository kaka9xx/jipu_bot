import fs from "fs";
import path from "path";

const file = path.resolve("src/utils/lang.json");
const data = JSON.parse(fs.readFileSync(file, "utf-8"));

export function getText(lang = "vi") {
  return data[lang] || data["vi"];
}