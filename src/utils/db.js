import fs from "fs";

const file = "./src/data/users.json";
let users = [];

try {
  users = JSON.parse(fs.readFileSync(file));
} catch {
  users = [];
}

export function findUser(id) {
  return users.find(u => u.user_id === id);
}

export function addUser(user) {
  users.push(user);
  save();
  return user;
}

export function updateUser(id, data) {
  const user = findUser(id);
  if (user) {
    Object.assign(user, data);
    save();
  }
}

function save() {
  fs.writeFileSync(file, JSON.stringify(users, null, 2));
}
