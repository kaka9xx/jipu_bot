// src/features/deleteUser.js
const fs = require("fs");
const csv = require("csv-parser");
const { Parser } = require("json2csv");
const fetch = require("node-fetch");
const { deleteById, getAllUsers, getUserById } = require("../services/userRepo");

// ✅ ADMIN_IDS lấy từ .env
const ADMIN_IDS = (process.env.ADMIN_IDS || "123456789")
  .split(",")
  .map((id) => id.trim())
  .filter((id) => id.length > 0);

/**
 * Check quyền admin
 */
async function isAdmin(chatId) {
  if (ADMIN_IDS.includes(String(chatId))) return true;
  try {
    const user = await getUserById(chatId);
    if (user && user.role === "admin") return true;
  } catch (err) {
    console.error("⚠️ isAdmin check error:", err);
  }
  return false;
}

/**
 * Xóa user theo chatId (chỉ admin được phép)
 */
async function deleteUserFeature(bot, msg, chatId) {
  if (!(await isAdmin(chatId))) {
    return bot.sendMessage(chatId, "⛔ You are not authorized to use this command.");
  }

  const parts = msg.text.trim().split(" ");
  if (parts.length < 2) {
    return bot.sendMessage(chatId, "⚠️ Usage: /deleteuser <chatId>");
  }

  const targetId = Number(parts[1]);
  if (isNaN(targetId)) {
    return bot.sendMessage(chatId, "⚠️ Invalid chatId. Must be a number.");
  }

  try {
    const result = await deleteById(targetId);
    if (result && result.deletedCount > 0) {
      bot.sendMessage(chatId, `✅ User ${targetId} deleted successfully.`);
    } else {
      bot.sendMessage(chatId, `ℹ️ User ${targetId} not found.`);
    }
  } catch (err) {
    console.error("❌ Delete user error:", err);
    bot.sendMessage(chatId, "❌ Failed to delete user.");
  }
}

/**
 * Trả về chatId của user (hỗ trợ setup ADMIN_IDS)
 */
async function whoAmIFeature(bot, msg, chatId) {
  bot.sendMessage(chatId, `👤 Your chatId: \`${chatId}\``, { parse_mode: "Markdown" });
}

/**
 * Xóa nhiều user qua CSV
 */
async function deleteUserCsvFeature(bot, msg, chatId) {
  if (!(await isAdmin(chatId))) {
    return bot.sendMessage(chatId, "⛔ You are not authorized.");
  }
  bot.sendMessage(chatId, "📂 Please upload a CSV file with <b>chatId</b> column.", { parse_mode: "HTML" });
}

/**
 * Khi nhận file CSV từ admin → xử lý xóa
 */
async function handleCsvUpload(bot, msg) {
  const chatId = msg.chat.id;
  if (!(await isAdmin(chatId))) return;
  if (msg.document.mime_type !== "text/csv") return;

  const fileId = msg.document.file_id;
  const token = process.env.BOT_TOKEN;
  const file = await bot.getFile(fileId);
  const url = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

  try {
    const res = await fetch(url);
    const buffer = Buffer.from(await res.arrayBuffer());
    const tmpPath = `/tmp/users.csv`;
    fs.writeFileSync(tmpPath, buffer);

    let deleted = 0;
    let notFound = 0;

    const rows = [];
    fs.createReadStream(tmpPath)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", async () => {
        for (const row of rows) {
          const targetId = Number(row.chatId);
          if (!isNaN(targetId)) {
            const result = await deleteById(targetId);
            if (result && result.deletedCount > 0) {
              deleted++;
            } else {
              notFound++;
            }
          }
        }

        bot.sendMessage(chatId, `✅ Deleted: ${deleted}, ℹ️ Not found: ${notFound}`);
      });
  } catch (err) {
    console.error("❌ CSV delete error:", err);
    bot.sendMessage(chatId, "❌ Failed to process CSV.");
  }
}

/**
 * Export toàn bộ user ra CSV
 */
async function exportUsersFeature(bot, msg, chatId) {
  if (!(await isAdmin(chatId))) {
    return bot.sendMessage(chatId, "⛔ You are not authorized.");
  }

  try {
    const users = await getAllUsers();
    if (!users.length) {
      return bot.sendMessage(chatId, "ℹ️ No users found.");
    }

    const fields = ["id", "username", "first_name", "lang", "points", "coins"];
    const parser = new Parser({ fields });
    const csvData = parser.parse(users);

    const filePath = `/tmp/users_export.csv`;
    fs.writeFileSync(filePath, csvData);

    await bot.sendDocument(chatId, filePath, {}, { filename: "users_export.csv" });
  } catch (err) {
    console.error("❌ Export users error:", err);
    bot.sendMessage(chatId, "❌ Failed to export users.");
  }
}

module.exports = {
  deleteUserFeature,
  whoAmIFeature,
  deleteUserCsvFeature,
  handleCsvUpload,
  exportUsersFeature,
};
