import fs from "fs";

const userDBFile = "./database/users.json";

export function loadDB() {
  if (!fs.existsSync(userDBFile)) return {};
  return JSON.parse(fs.readFileSync(userDBFile, "utf8"));
}

export function saveDB(db) {
  fs.writeFileSync(userDBFile, JSON.stringify(db, null, 2));
}
