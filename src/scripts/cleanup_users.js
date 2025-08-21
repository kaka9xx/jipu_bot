// src/scripts/cleanup_users.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    const allUsers = await User.find({});
    const grouped = {};

    for (const u of allUsers) {
      if (!grouped[u.id]) grouped[u.id] = [];
      grouped[u.id].push(u);
    }

    let removed = 0;
    for (const id in grouped) {
      if (grouped[id].length > 1) {
        grouped[id].sort((a, b) => b.updatedAt - a.updatedAt);
        const keep = grouped[id][0];
        const remove = grouped[id].slice(1);

        for (const r of remove) {
          await User.deleteOne({ _id: r._id });
          removed++;
        }
        console.log(`⚡ Cleaned user ${id}, kept _id=${keep._id}, removed ${remove.length}`);
      }
    }

    console.log(`✅ Done. Removed ${removed} duplicate docs.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
