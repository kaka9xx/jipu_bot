// src/scripts/cleanup_users.js

try { require('dotenv').config(); }
catch (err) { console.warn("⚠️ Module 'dotenv' chưa được cài, dùng process.env trực tiếp."); }

const mongoose = require('mongoose');
const User = require('../models/User');
const fs = require('fs');
const { Parser } = require('json2csv');
const path = require('path');

const ScriptRunSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  runAt: { type: Date, default: Date.now }
});
const ScriptRun = mongoose.model('ScriptRun', ScriptRunSchema);

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error("❌ Không tìm thấy MONGO_URI trong .env!"); process.exit(1); }

const ADMIN_IDS = (process.env.ADMIN_IDS || "")
  .split(",").map(id => id.trim()).filter(Boolean);

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const force = args.includes('--force');

// --- Tạo file log ---
const nowStr = new Date().toISOString().replace(/[:.]/g,'-');
const logFile = path.join(__dirname, `cleanup_users_${nowStr}.log`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

function log(...args) {
  console.log(...args);
  logStream.write(args.join(' ') + '\n');
}

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    log("✅ Connected to MongoDB");

    if (!force) {
      const alreadyRun = await ScriptRun.findOne({ name: 'cleanup_users' });
      if (alreadyRun) {
        log("⚡ Cleanup đã chạy trước đó, thoát script.");
        process.exit(0);
      }
    } else {
      log("⚡ --force được bật, sẽ chạy cleanup bất chấp trạng thái trước đó.");
    }

    const allUsers = await User.find({});
    log(`🔹 Tổng user: ${allUsers.length}`);

    const grouped = {};
    const adminDuplicates = [];
    const deletedUsers = [];
    let removed = 0;

    for (const u of allUsers) {
      const idStr = u.id.toString();
      if (!grouped[idStr]) grouped[idStr] = [];
      grouped[idStr].push(u);
    }

    for (const id in grouped) {
      if (grouped[id].length > 1) {
        grouped[id].sort((a,b) => b.updatedAt - a.updatedAt);
        const keep = grouped[id][0];
        const remove = grouped[id].slice(1);

        if (ADMIN_IDS.includes(id)) {
          adminDuplicates.push({ adminId: id, keepId: keep._id, duplicates: remove.map(r=>r._id) });
          continue;
        }

        if (!dryRun) {
          for (const r of remove) {
            await User.deleteOne({ _id: r._id });
            deletedUsers.push({ userId: id, deletedId: r._id });
            removed++;
          }
        }

        log(`⚡ Cleaned user ${id}, kept _id=${keep._id}, removed ${remove.length} ${dryRun ? '(dry-run)' : ''}`);
      }
    }

    if (adminDuplicates.length > 0) {
      log("🔹 Admin trùng lặp (không xóa):");
      adminDuplicates.forEach(a => {
        log(`  Admin ${a.adminId}, giữ _id=${a.keepId}, trùng lặp: [${a.duplicates.join(', ')}]`);
      });
    }

    // --- Xuất CSV ---
    if (adminDuplicates.length > 0) {
      const parserAdmin = new Parser();
      const csvAdmin = parserAdmin.parse(adminDuplicates);
      fs.writeFileSync(path.join(__dirname, `admin_duplicates_${nowStr}.csv`), csvAdmin);
      log(`📄 File admin trùng lặp xuất ra: admin_duplicates_${nowStr}.csv`);
    }

    if (deletedUsers.length > 0) {
      const parserDel = new Parser();
      const csvDel = parserDel.parse(deletedUsers);
      fs.writeFileSync(path.join(__dirname, `deleted_users_${nowStr}.csv`), csvDel);
      log(`📄 File user bị xóa xuất ra: deleted_users_${nowStr}.csv`);
    }

    if (!dryRun) await ScriptRun.create({ name: 'cleanup_users' });

    log(`✅ Done. Removed ${removed} duplicate docs (không bao gồm admin). ${dryRun ? 'Dry-run, chưa xóa gì.' : ''}`);
    log(`📄 File log: ${logFile}`);
    logStream.end();
    process.exit(0);

  } catch (err) {
    log("❌ Error:", err);
    logStream.end();
    process.exit(1);
  }
})();
