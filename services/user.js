import { readDB, writeDB } from "../utils/db.js";

const USERS_FILE = "users.json";

// Lấy toàn bộ user
export function getAllUsers() {
  return readDB(USERS_FILE);
}

// Lấy user theo user_id
export function getUser(userId) {
  const users = readDB(USERS_FILE);
  return users.find(u => u.user_id === userId);
}

// Đăng ký hoặc cập nhật user
export function registerOrUpdateUser(telegramUser) {
  const users = readDB(USERS_FILE);

  const existingUser = users.find(u => u.user_id === telegramUser.id);

  if (existingUser) {
    // update metadata nếu thay đổi
    let updated = false;

    if (existingUser.first_name !== telegramUser.first_name) {
      existingUser.first_name = telegramUser.first_name;
      updated = true;
    }

    if (existingUser.username !== telegramUser.username) {
      existingUser.username = telegramUser.username || null;
      updated = true;
    }

    if (updated) writeDB(USERS_FILE, users);

    return existingUser;
  }

  // Nếu chưa tồn tại → tạo mới
  const newUser = {
    user_id: telegramUser.id,
    first_name: telegramUser.first_name,
    username: telegramUser.username || null,
    balance: 0,
    referral_code: `REF${telegramUser.id}`,
    created_at: new Date().toISOString()
  };

  users.push(newUser);
  writeDB(USERS_FILE, users);

  return newUser;
}
