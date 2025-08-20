// src/scripts/migrate_users_to_mongo.js
// Run with: node src/scripts/migrate_users_to_mongo.js
require('dotenv').config();
const connectDB = require('../../src/core/db');
const User = require('../../src/models/User');
const fs = require('fs');
const path = require('path');

async function main() {
  await connectDB();
  const dataFile = path.join(__dirname, '../../data/users.json');
  if (!fs.existsSync(dataFile)) {
    console.log('No data/users.json found to migrate.');
    process.exit(0);
  }
  const raw = fs.readFileSync(dataFile, 'utf-8');
  const arr = JSON.parse(raw || '[]');
  console.log('Found', arr.length, 'users to migrate.');
  for (const u of arr) {
    try {
      await User.findOneAndUpdate({ id: u.id }, { $set: u }, { upsert: true, new: true });
      console.log('Migrated user', u.id);
    } catch (e) {
      console.error('Error migrating', u.id, e);
    }
  }
  console.log('Migration complete.');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
