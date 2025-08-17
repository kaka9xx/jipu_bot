import fs from "fs";
import path from "path";

const DB_DIR = "./database";
const DB_FILE = path.join(DB_DIR, "users.json");

// Ensure file/dir exist
function ensureDB() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({}, null, 2));
}
function load() {
  ensureDB();
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}
function save(db) {
  ensureDB();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

export async function getUser(userId) {
  const db = load();
  if (!db[userId]) {
    db[userId] = { lang: "vi", balance: 0, referrals: [] };
    save(db);
  }
  return db[userId];
}

export async function getUserLang(userId) {
  const u = await getUser(userId);
  return u.lang || "vi";
}

export async function setUserLang(userId, lang) {
  const db = load();
  db[userId] = db[userId] || { lang: "vi", balance: 0, referrals: [] };
  db[userId].lang = lang;
  save(db);
}

export async function addBalance(userId, delta) {
  const db = load();
  db[userId] = db[userId] || { lang: "vi", balance: 0, referrals: [] };
  db[userId].balance = (db[userId].balance || 0) + delta;
  save(db);
  return db[userId].balance;
}

export async function getBalance(userId) {
  const u = await getUser(userId);
  return u.balance || 0;
}

export async function addReferral(inviterId, referredId) {
  const db = load();
  db[inviterId] = db[inviterId] || { lang: "vi", balance: 0, referrals: [] };
  if (!db[inviterId].referrals.includes(referredId)) {
    db[inviterId].referrals.push(referredId);
    save(db);
  }
  return db[inviterId].referrals.length;
}
