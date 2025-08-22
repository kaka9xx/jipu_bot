// src/scripts/cleanup_users_simple_mongo.js
try { require('dotenv').config(); }
catch (err) { console.warn("⚠️ Module 'dotenv' chưa được cài, dùng process.env trực tiếp."); }

const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error("❌ Không tìm thấy MONGO_URI trong .env!"); process.exit(1); }

const ADMIN_IDS = (process.env.ADMIN_IDS || "")
  .split(",").map(id => id.trim()).filter(Boolean);

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

(async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    const allUsers = await User.find({});
    console.log(`🔹 Tổng user: ${allUsers.length}`);

    const grouped = {};
    let removed = 0;

    for (const u of allUsers) {
      const idStr = u.id.toString();
      if (!grouped[idStr]) grouped[idStr] = [];
      grouped[idStr].push(u);
    }

    for (const id in grouped) {
      if (grouped[id].length > 1 && !ADMIN_IDS.includes(id)) {
        grouped[id].sort((a,b) => b.updatedAt - a.updatedAt);
        const keep = grouped[id][0];
        const remove = grouped[id].slice(1);

        removed += remove.length;
        if (!dryRun) {
          for (const r of remove) {
            await User.deleteOne({ _id: r._id });
          }
        }

        console.log(`⚡ Cleaned user ${id}, kept _id=${keep._id}, removed ${remove.length} ${dryRun ? '(dry-run)' : ''}`);
      } else if (ADMIN_IDS.includes(id)) {
        console.log(`⚡ Admin ${id} giữ nguyên, không xóa.`);
      }
    }

    console.log(`✅ Done. Removed ${removed} duplicate docs. ${dryRun ? 'Dry-run, chưa xóa gì.' : ''}`);
    process.exit(0);

  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
