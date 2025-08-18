import fs from "fs";
import path from "path";

const DB_PATH = path.resolve("src/data/users.json");

function ensureDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
  }
}

export function loadUsers() {
  ensureDB();
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

export function saveUsers(users) {
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

export function findUser(user_id) {
  return loadUsers().find(u => u.user_id === user_id);
}

export function addUser(user) {
  const users = loadUsers();
  users.push(user);
  saveUsers(users);
  return user;
}

export function updateUser(user_id, updates) {
  const users = loadUsers();
  const idx = users.findIndex(u => u.user_id === user_id);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updates };
    saveUsers(users);
    return users[idx];
  }
  return null;
}