// src/features/deleteUser.js
const { deleteById, getAllUsers, getUserById } = require("../services/userRepo");

// ✅ ADMIN_IDS lấy từ .env
const ADMIN_IDS = (process.env.ADMIN_IDS || "123456789")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

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
 * Xóa user theo chatId (chỉ admin)
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
 * Xem chatId của bản thân
 */
async function whoAmIFeature(bot, msg, chatId) {
  bot.sendMessage(chatId, `👤 Your chatId: \`${chatId}\``, { parse_mode: "Markdown" });
}

/**
 * Export users ra JSON (thay CSV)
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

    const filePath = `/tmp/users_export.json`;
    const jsonData = JSON.stringify(users, null, 2);
    require("fs").writeFileSync(filePath, jsonData, "utf-8");

    await bot.sendDocument(chatId, filePath, {}, { filename: "users_export.json" });
  } catch (err) {
    console.error("❌ Export users error:", err);
    bot.sendMessage(chatId, "❌ Failed to export users.");
  }
}

module.exports = {
  deleteUserFeature,
  whoAmIFeature,
  exportUsersFeature,
};
