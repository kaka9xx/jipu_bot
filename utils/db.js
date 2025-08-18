import fs from "fs";
import path from "path";

const dbFile = path.resolve("src/data/users.json");

// đọc DB
export function loadUsers() {
  try {
    const data = fs.readFileSync(dbFile, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// ghi DB
export function saveUsers(users) {
  fs.writeFileSync(dbFile, JSON.stringify(users, null, 2));
}

// tìm user
export function findUser(id) {
  const users = loadUsers();
  return users.find(u => u.id === id);
}

// thêm user mới
export function addUser(id, name, lang = "vi") {
  let users = loadUsers();
  if (!users.find(u => u.id === id)) {
    const newUser = {
      id,
      name,
      lang,
      balance: 0,
      referredBy: null
    };
    users.push(newUser);
    saveUsers(users);
    return newUser;
  }
  return null;
}

// update user field
export function updateUser(id, updates = {}) {
  let users = loadUsers();
  users = users.map(u => (u.id === id ? { ...u, ...updates } : u));
  saveUsers(users);
}
