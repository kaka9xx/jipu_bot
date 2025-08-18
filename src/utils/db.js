import fs from "fs";
const DB_PATH = "./data/users.json";

export function findUser(id) {
  const users = JSON.parse(fs.readFileSync(DB_PATH));
  return users.find(u => u.user_id === id);
}

export function addUser(user) {
  const users = JSON.parse(fs.readFileSync(DB_PATH));
  users.push(user);
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
  return user;
}

export function updateUser(id, updates) {
  const users = JSON.parse(fs.readFileSync(DB_PATH));
  const idx = users.findIndex(u => u.user_id === id);
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...updates };
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
  }
}
