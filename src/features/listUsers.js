// src/features/listUsers.js
const { getAll } = require("../services/userRepo");

// ✅ ADMIN_IDS lấy từ .env
const ADMIN_IDS = (process.env.ADMIN_IDS || "123456789")
  .split(",")
  .map((id) => id.trim());

// ✅ Hàm check quyền admin
async function isAdmin(chatId) {
  if (ADMIN_IDS.includes(String(chatId))) return true;
  try {
    const users = await getAll();
    const found = users.find(u => u.id === Number(chatId) && u.role === "admin");
    if (found) return true;
  } catch (err) {
    console.error("⚠️ isAdmin error:", err);
  }
  return false;
}

async function listUsersFeature(bot, msg, chatId) {
  // Chỉ admin mới chạy
  if (!(await isAdmin(chatId))) {
    return bot.sendMessage(chatId, "⛔ You are not authorized to use this command.");
  }

  try {
    const users = await getAll();

    if (!users || users.length === 0) {
      return bot.sendMessage(chatId, "ℹ️ No users found.");
    }

    // Hiển thị tối đa 20 user, không xuất CSV
    const maxUsers = 20;
    const userList = users
      .slice(0, maxUsers)
      .map(
        (u, i) =>
          `${i + 1}. ID: ${u.id} | Name: ${u.first_name || "N/A"} | Username: @${
            u.username || "N/A"
          } | Lang: ${u.lang}`
      )
      .join("\n");

    let message = `👥 Total users: ${users.length}\n\n${userList}`;
    if (users.length > maxUsers) {
      message += `\n\n...and ${users.length - maxUsers} more users.`;
    }

    bot.sendMessage(chatId, message);
  } catch (err) {
    console.error("❌ listUsersFeature error:", err);
    bot.sendMessage(chatId, "❌ Failed to list users.");
  }
}

module.exports = { listUsersFeature };
