// src/features/listUsers.js
const { getAll } = require("../services/userRepo");
const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");

// ✅ ADMIN_IDS lấy từ .env
const ADMIN_IDS = (process.env.ADMIN_IDS || "123456789")
  .split(",")
  .map((id) => id.trim());

// ✅ Hàm check quyền admin
async function isAdmin(chatId) {
  if (ADMIN_IDS.includes(String(chatId))) return true;
  try {
    const user = await getUserById(chatId);
    if (user && user.role === "admin") return true; // check thêm trong DB
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

  const parts = msg.text.trim().split(" ");
  const isFull = parts.length > 1 && parts[1] === "full";

  try {
    const users = await getAll();

    if (!users || users.length === 0) {
      return bot.sendMessage(chatId, "ℹ️ No users found.");
    }

    // ✅ Nếu admin yêu cầu full -> export CSV
    if (isFull) {
      const fields = ["id", "first_name", "username", "lang", "points", "coins", "createdAt", "updatedAt"];
      const parser = new Parser({ fields });
      const csv = parser.parse(users);

      const filePath = path.join(__dirname, "../../data/users_export.csv");
      fs.writeFileSync(filePath, csv, "utf-8");

      return bot.sendDocument(chatId, filePath, {
        caption: `📂 Exported ${users.length} users.`,
      });
    }

    // ✅ Ngược lại, chỉ hiển thị tối đa 20 user
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
