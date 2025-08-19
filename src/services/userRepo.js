// src/services/userRepo.js
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../../users.json");

function load() {
  if (!fs.existsSync(dbPath)) return { users: [] };
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function save(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
}

async function getUserById(id) {
  const db = load();
  return db.users.find(u => u.id === id);
}

async function createUser(user) {
  const db = load();
  db.users.push(user);
  save(db);
  return user;
}

async function updateUser(id, updates) {
  const db = load();
  const idx = db.users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  db.users[idx] = { ...db.users[idx], ...updates };
  save(db);
  return db.users[idx];
}

module.exports = { getUserById, createUser, updateUser };
